/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import AdminJS from "adminjs";
import { Router } from "express";
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport/index.js'

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
    router: Router,
    admin: AdminJS,
    auth: AuthenticationOptions
  ): void => {
    const suffixRegPath = getRegisterPath(registerPath,admin);
    const suffixEmailSentPath = getRegisterPath(emailSentPath,admin)
    
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

    router.get(suffixEmailSentPath, async (req, res) => {
      const email = req.session.email as any;
      const baseProps = {
        action: suffixEmailSentPath,
        errorMessage: null,
        email: email
      };
      console.log("inside withRegister get emailSent email", email);
      const register = await admin.renderRegister({
        ...baseProps,
      });
  
      return res.send(register);
    });
  
    router.post(suffixRegPath, async (req: any, res, next) => {

        const context: AuthenticationContext = { req, res };
        let adminUser;
        
        const { email, password } = req.fields as {
          email: string;
          password: string;
        };
        // "auth.authenticate" must always be defined if "auth.provider" isn't
        //adminUser = await auth.authenticate!(email, password, context);
        sendEmail(
          process.env.FMAIL_SENDER,
          email,
          process.env.MAIL_SUBJECT_PREFIX,
          "register test",
          "<b>register test</b>"
        )
        const register = await admin.renderRegister({
          action: registerPath,
          postMessage: `Email sent to: ${email}`,
        });

        req.session.email = email;
  
        return res.redirect(302, emailSentPath);
    });
  };