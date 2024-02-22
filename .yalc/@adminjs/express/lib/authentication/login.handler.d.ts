import AdminJS from "adminjs";
import { Router } from "express";
import type { AuthenticationOptions } from "../types.js";
export declare const withLogin: (router: Router, admin: AdminJS, loginPath: string, gmailCallbackPath: string, auth: AuthenticationOptions) => void;
