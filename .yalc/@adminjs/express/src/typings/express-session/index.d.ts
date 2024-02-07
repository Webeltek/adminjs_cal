export {};

declare module "express-session" {
  interface SessionData {
    unconfUser?: unknown;
    adminUser?: unknown;
    redirectTo?: string;
    email?: string;
    postMessage?: string;
  }
}
