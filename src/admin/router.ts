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

export const createUnconfUser = async ( email, password,ou, cont : AuthenticationContext) => {
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
          ou : ou,
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
      ou : unconfUser.ou
    };
    let nfConfUser = await client.nf_user.create({ data: confUser});
    return nfConfUser;
  }
}

export const authenticateGmailUser = async (email : string | undefined,google_sub: string | undefined)=>{
  const foundUser = await client.nf_user.findFirst({
    where: {
      user_email : email
    }
  });
  if (foundUser ) {
    const userData = {
    id  : foundUser.id,               
    user_email : foundUser.user_email,         
    vipps_sub : foundUser.vipps_sub,         
    google_sub : foundUser.google_sub,      
    access_token : foundUser.access_token,      
    last_seen : foundUser.last_seen,         
    is_admin : foundUser.is_admin,          
    ou : foundUser.ou,               
    address : foundUser.address
    }
    return { ...userData };
  } else {
    let gmailUser =  {
      user_email: email, 
      google_sub: google_sub,
      user_confirmed: true,
      user_is_logged_in: true
    };
    let googleUser = await client.nf_user.create({ data: gmailUser});
    return {...googleUser}
  }
  return null;

}

export const authenticatePrismaUser = async (email,password) =>{
  const nf_user_model = dmmf.modelMap.nf_user;
  const foundUser = await client.nf_user.findFirst({
    where: {
      user_email : email
    }
  });
  //let isPassVerified = await argon2.verify(foundUser.user_pass_hash, password);
  //console.log('typeof isPassVerified',isPassVerified);
  
  if (foundUser && (await argon2.verify(foundUser.user_pass_hash, password))) {
    const userData = {
    id  : foundUser.id,               
    user_email : foundUser.user_email,         
    vipps_sub : foundUser.vipps_sub,         
    google_sub : foundUser.google_sub,        
    user_is_logged_in : foundUser.user_is_logged_in, 
    user_confirmed : foundUser.user_confirmed,    
    user_conf_by_admin : foundUser.user_conf_by_admin,
    access_token : foundUser.access_token,      
    last_seen : foundUser.last_seen,         
    is_admin : foundUser.is_admin,          
    ou : foundUser.ou,               
    address : foundUser.address
    }
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
      authenticateGmailUser: authenticateGmailUser,
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
