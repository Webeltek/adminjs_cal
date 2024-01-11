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
import { PrismaClient } from '@prisma/client';
import { dmmf } from '../sources/prisma/config.js';
import formidableMiddleware from "express-formidable";
import { FormidableOptions,AuthenticationContext, AuthenticationOptions } from '@adminjs/express';
import { OldBodyParserUsedError, WrongArgumentError } from '@adminjs/express';

export const authenticateUser = async (email, password) => {
  const prClient = new PrismaClient();
  const nf_user_model = dmmf.modelMap.nf_user;
  const foundUser = await prClient.nf_user.findFirst({
    where: {
      user_email : email
    }
  })

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
