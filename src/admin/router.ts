import AdminJSExpress from '@adminjs/express';
import AdminJSFastify from '@adminjs/fastify';
import AdminJS from 'adminjs';
import argon2 from 'argon2';
import { FastifyInstance } from 'fastify';
import ConnectPgSimple from 'connect-pg-simple';
import session from 'express-session';
import { Router , Request} from 'express';
import express from "express";
import { AdminModel } from '../sources/mongoose/models/index.js';
import { AuthUsers } from './constants/authUsers.js';
import { dmmf, client } from '../sources/prisma/config.js';
import formidableMiddleware from "express-formidable";
import { FormidableOptions,AuthenticationContext, AuthenticationOptions } from '@adminjs/express';
import { OldBodyParserUsedError, WrongArgumentError } from '@adminjs/express';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { SessionData } from '@adminjs/express';

export const createUnconfUser = async ( email, password, cont : AuthenticationContext) => {
      const foundUser = await client.nf_user.findUnique({
        where: {
          user_email : email
        }
      });
      if (foundUser){
        return "user_exists";
      } else {
        let uid = uuidv4();
        let conf_token= jwt.sign({ confirm: uid }, process.env.SESSION_SECRET ?? 'sessionsecret', {
        expiresIn: '1h',});
        let unconfUser =  {
          uid : uid,
          user_email: email, 
          user_pass_hash: await argon2.hash(password),
          user_confirmed: false,
          conf_token : conf_token
        };  
        return unconfUser;
      }

}

export const confUser = async (reqConfToken : string, unconfUser) => {
  
  let decoded = jwt.verify(reqConfToken, process.env.SESSION_SECRET ?? 'sessionsecret');
  console.log("decoded", decoded);
  const { uid } = unconfUser;
  const { confirm : decodedUid } = decoded as any;
  if ( uid === decodedUid){
    let confUser =  {
      user_email: unconfUser.user_email, 
      user_pass_hash: unconfUser.user_pass_hash,
      user_confirmed: true,
    };
    let nfConfUser = await client.nf_user.create({ data: confUser});
    return nfConfUser;
  }
  
}

export const authenticatePrismaUser = async (email,password) =>{
  const nf_user_model = dmmf.modelMap.nf_user;
  const foundUser = await client.nf_user.findFirst({
    where: {
      user_email : email
    }
  });
  let isPassVerified = await argon2.verify(foundUser.user_pass_hash, password);
  console.log('typeof isPassVerified',isPassVerified);
  
  if (foundUser && (await argon2.verify(foundUser.user_pass_hash, password))) {
    const userData = foundUser;
    return { ...userData };
  }
  return null;
}

export const authenticateUser = async (email, password) => {

  const user = await AdminModel.findOne({ email });
  if (user && (await argon2.verify(user.password, password))) {
    const userData = AuthUsers.find((au) => email === au.email);
    return { ...userData, ...user.toObject() };
  }
  return null;
};

export const expressAuthenticatedRouter = (adminJs: AdminJS, router: Router | null = null) => {
  const ConnectSession = ConnectPgSimple(session);

  const sessionStore = new ConnectSession({
    conObject: {
      connectionString: process.env.POSTGRES_DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production',
    },
    tableName: 'session',
    createTableIfMissing: true,
  });

  return AdminJSExpress.buildAuthenticatedRouter(
    adminJs,
    {
      createUnconfUser: createUnconfUser,
      confUser : confUser,
      authenticatePrismaUser : authenticatePrismaUser,
      authenticate: authenticateUser,
      cookieName: 'adminjs',
      cookiePassword: process.env.SESSION_SECRET ?? 'sessionsecret',
    },
    router,
    {
      store: sessionStore,
      resave: true,
      saveUninitialized: true,
      secret: process.env.SESSION_SECRET ?? 'sessionsecret',
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      },
      name: 'adminjs',
    },
  );
};

export const fastifyAuthenticatedRouter = (adminJs: AdminJS, app: FastifyInstance) =>
  AdminJSFastify.buildAuthenticatedRouter(
    adminJs,
    {
      cookiePassword: 'secretsecretsecretsecretsecretsecretsecretsecret',
      authenticate: authenticateUser,
    },
    app,
  );
