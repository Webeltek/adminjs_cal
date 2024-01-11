/* eslint-disable prettier/prettier */
import AdminJS from "adminjs";
import { Router } from "express";

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
  
  export const withRegister = (
    registerPath: string,
    router: Router,
    admin: AdminJS,
    auth: AuthenticationOptions
  ): void => {
    const regPath = getRegisterPath(registerPath,admin);
    
    console.log("inside withRegister ")
    router.get(regPath, async (req, res) => {
      const baseProps = {
        action: registerPath,
        errorMessage: null,
      };
      console.log("inside withRegister get")
      const register = await admin.renderRegister({
        ...baseProps,
      });
  
      return res.send(register);
    });
  
    router.post(regPath, async (req: any, res, next) => {

        const context: AuthenticationContext = { req, res };
        let adminUser;
        
        const { email, password } = req.fields as {
          email: string;
          password: string;
        };
        // "auth.authenticate" must always be defined if "auth.provider" isn't
        adminUser = await auth.authenticate!(email, password, context);
        const register = await admin.renderRegister({
          action: registerPath,
          errorMessage: "invalidCredentials",
        });
  
        return res.send(register);
    });
  };