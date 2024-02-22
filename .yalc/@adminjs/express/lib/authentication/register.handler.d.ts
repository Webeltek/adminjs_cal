import AdminJS from "adminjs";
import { Router } from "express";
import type { AuthenticationOptions } from "../types.js";
export declare const withRegister: (registerPath: string, emailSentPath: string, confirmPath: string, router: Router, admin: AdminJS, auth: AuthenticationOptions) => void;
