/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import AdminJS from "adminjs";
import { Router } from "express";
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';

import type {
  AuthenticationContext,
  AuthenticationMaxRetriesOptions,
  AuthenticationOptions,
} from "../types.js";

const getRegisterPath = (registerPath: string,admin: AdminJS): string => {
    const { rootPath } = admin.options;
    // since we are inside already namespaced router we have to replace login and logout routes that
    // they don't have rootUrl inside. So changing /admin/login to just /login.
    // but there is a case where user gives / as a root url and /login becomes `login`. We have to
    // fix it by adding / in front of the route
    const normalizedRegisterPath = registerPath.replace(rootPath, "");
  
    return normalizedRegisterPath.startsWith("/")
      ? normalizedRegisterPath
      : `/${normalizedRegisterPath}`;
  };

  const opt = new SMTPTransport({
  host : process.env.MAIL_SERVER,
  port: Number.parseInt(process.env.MAIL_PORT as string),
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  })
  const transporter = nodemailer.createTransport(opt);

  async function sendEmail(from:string | undefined, to: string,subject: string|undefined,text: string, html: string){
    const info = await transporter.sendMail({
      from: from, // sender address
      to: to ,// list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: html, // html body
    });
  
    console.log("Message sent: %s", info.messageId);
  }
  
  export const withRegister = (
    registerPath: string,
    emailSentPath: string,
    confirmPath: string,
    router: Router,
    admin: AdminJS,
    auth: AuthenticationOptions
  ): void => {
    const suffixRegPath = getRegisterPath(registerPath,admin);
    const suffixEmailSentPath = getRegisterPath(emailSentPath,admin);
    const suffixConfirmPath = getRegisterPath(confirmPath,admin);
    
    //console.log("inside withRegister ")
    router.get(suffixRegPath, async (req, res) => {
      const baseProps = {
        action: registerPath,
        errorMessage: null,
      };
      //console.log("inside withRegister get")
      const register = await admin.renderRegister({
        ...baseProps,
      });
  
      return res.send(register);
    });
  
    router.post(suffixRegPath, async (req: any, res, next) => {
        const context: AuthenticationContext = { req, res };
        const { email, password } = req.fields as {
          email: string;
          password: string;
        };
        let unconfUser = await auth.createUnconfUser!(email,password,context);
        let fullUrlPath = `${req.protocol}://${req.get('host')}${req.originalUrl}/confirm/`
        //console.log("post unconfUser",unconfUser);
        
        // "auth.authenticate" must always be defined if "auth.provider" isn't
        //adminUser = await auth.authenticate!(email, password, context);
        if (unconfUser){
          let { conf_token } = unconfUser as any;
          sendEmail(
            process.env.FMAIL_SENDER,
            email,
            process.env.MAIL_SUBJECT_PREFIX,
            "",
            `<p>Dear ${ email },</p>
            <p>Welcome to <b>domain address</b>!</p>
            <p>To confirm your account please</p> 
            <p><a href="${fullUrlPath+conf_token}">click here</a>.</p>
            <p>Alternatively, you can paste the following link in your browser's address bar:</p>
            <p><a href="{{ url_for('auth_bp.confirm',_external=True, token=token) }}">
                {{ url_for('auth_bp.confirm',_external=True, token=token) }}</a></p>
            <p>Sincerely,</p>
            <p>The Team</p>
            <p><small>Note: replies to this email address are not monitored.</small></p>`
          )
  
          req.session.email = email;
          req.session.unconfUser = unconfUser as object;
          req.session.save((err) => {
            if (err) {
              return next(err);
            }
            if (req.session.redirectTo) {
              return res.redirect(302, req.session.redirectTo);
            } else {
              return res.redirect(302, emailSentPath);
            }
          });
    
        } else {
          const baseProps = {
            action: registerPath,
            errorMessage: "Error in confirm initialisation",
          };
          //console.log("inside withRegister get")
          const register = await admin.renderRegister({
            ...baseProps,
          });
      
          return res.send(register);
        }
        
    });

    router.get(suffixEmailSentPath, async (req, res) => {
      const email = req.session.email;
      const baseProps = {
        action: emailSentPath,
        errorMessage: null,
        email: email,
        postMessage: 'Register.emailSentTo',
      };
      console.log("register.handler emailSentPath unconfUser", req.session.unconfUser);
      const register = await admin.renderRegister({
        ...baseProps,
      });
  
      return res.send(register);
    });

    router.get(suffixConfirmPath, async (req: any, res, next) => {
      const context: AuthenticationContext = { req, res };
      const unconfUser = req.session.unconfUser;
      const { conf_token } = unconfUser;
      const reqConfToken =  req.params.conf_token;
      let confUser = await auth.confUser!(reqConfToken,unconfUser);
      console.log("register.handler confirmPath confUser",confUser);
      if (confUser) {
        req.session.adminUser = confUser;
        req.session.save((err) => {
          if (err) {
            return next(err);
          }
          if (req.session.redirectTo) {
            return res.redirect(302, req.session.redirectTo);
          } else {
            return res.redirect(302, admin.options.rootPath);
          }
        });
      } else {
        const register = await admin.renderRegister({
          action: registerPath,
          errorMessage: "Wrong confirmation link",
        });
  
        return res.send(register);
      }

  });

  };