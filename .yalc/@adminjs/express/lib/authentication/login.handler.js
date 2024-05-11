import { OAuth2Client } from "google-auth-library";
const getLoginPath = (loginPath, admin) => {
    const { rootPath } = admin.options;
    // since we are inside already namespaced router we have to replace login and logout routes that
    // they don't have rootUrl inside. So changing /admin/login to just /login.
    // but there is a case where user gives / as a root url and /login becomes `login`. We have to
    // fix it by adding / in front of the route
    const normalizedLoginPath = loginPath.replace(rootPath, "");
    return normalizedLoginPath.startsWith("/")
        ? normalizedLoginPath
        : `/${normalizedLoginPath}`;
};
class Retry {
    constructor(ip) {
        this.retriesCount = 0;
        const existing = Retry.retriesContainer.get(ip);
        if (existing) {
            return existing;
        }
        Retry.retriesContainer.set(ip, this);
    }
    canLogin(maxRetries) {
        if (maxRetries === undefined) {
            return true;
        }
        else if (typeof maxRetries === "number") {
            maxRetries = {
                count: maxRetries,
                duration: 60,
            };
        }
        else if (maxRetries.count <= 0) {
            return true;
        }
        if (!this.lastRetry ||
            new Date().getTime() - this.lastRetry.getTime() >
                maxRetries.duration * 1000) {
            this.lastRetry = new Date();
            this.retriesCount = 1;
            return true;
        }
        else {
            this.lastRetry = new Date();
            this.retriesCount++;
            return this.retriesCount <= maxRetries.count;
        }
    }
}
Retry.retriesContainer = new Map();
export const withLogin = (router, admin, loginPath, gmailCallbackPath, auth) => {
    var _a, _b;
    const { rootPath } = admin.options;
    const suffixLoginPath = getLoginPath(loginPath, admin);
    const suffixGmailCallbackPath = getLoginPath(gmailCallbackPath, admin);
    const { provider } = auth;
    const providerProps = (_b = (_a = provider === null || provider === void 0 ? void 0 : provider.getUiProps) === null || _a === void 0 ? void 0 : _a.call(provider)) !== null && _b !== void 0 ? _b : {};
    router.get(suffixLoginPath, async (req, res) => {
        const baseProps = {
            action: admin.options.loginPath,
            errorMessage: null,
        };
        const login = await admin.renderRegister(Object.assign(Object.assign({}, baseProps), providerProps));
        return res.send(login);
    });
    router.post(suffixLoginPath, async (req, res, next) => {
        var _a;
        if (!new Retry(req.ip).canLogin(auth.maxRetries)) {
            const login = await admin.renderRegister(Object.assign({ action: admin.options.loginPath, errorMessage: "tooManyRequests" }, providerProps));
            return res.send(login);
        }
        const context = { req, res };
        let adminUser;
        const { email, password, theme } = req.fields;
        console.log("login.handler theme, req.session.adminUser", theme, req.session.adminUser);
        if (provider) {
            adminUser = await provider.handleLogin({
                headers: req.headers,
                query: req.query,
                params: req.params,
                data: (_a = req.fields) !== null && _a !== void 0 ? _a : {},
            }, context);
        }
        else {
            if (!theme) {
                // "auth.authenticate" must always be defined if "auth.provider" isn't
                adminUser = await auth.authenticatePrismaUser(email, password, theme);
            }
        }
        if (adminUser && !theme) {
            req.session.adminUser = adminUser;
            console.log("login.handler adminUser['user_email']", adminUser['user_email']);
            req.session.save((err) => {
                if (err) {
                    return next(err);
                }
                if (req.session.redirectTo) {
                    return res.redirect(302, req.session.redirectTo);
                }
                else {
                    return res.redirect(302, rootPath);
                }
            });
        }
        else if (req.session.adminUser && theme) {
            req.session.adminUser.theme = theme;
            req.session.save((err) => {
                if (err) {
                    return next(err);
                }
                if (req.session.redirectTo) {
                    return res.redirect(302, req.session.redirectTo);
                }
                else {
                    return res.send({ 'themeSavedInSession': 'req.session.adminUser.theme' });
                }
            });
        }
        else {
            const login = await admin.renderRegister(Object.assign({ action: admin.options.loginPath, errorMessage: "invalidCredentials" }, providerProps));
            return res.send(login);
        }
    });
    router.post(suffixGmailCallbackPath, async (req, res, next) => {
        //const context: AuthenticationContext = { req, res };
        const { credential } = req.query;
        const { rootPath } = admin.options;
        const verifyArr = await verify(credential)
            .catch((err) => console.log("register.handler verify error", err));
        const [email, google_sub] = verifyArr ? verifyArr : [];
        const adminUser = await auth.authenticateGmailUser(email, google_sub);
        if (adminUser) {
            req.session.adminUser = adminUser;
            //console.log("login.handler adminUser['user_email']",adminUser['user_email']);
            req.session.save((err) => {
                if (err) {
                    return next(err);
                }
                if (req.session.redirectTo) {
                    return res.redirect(302, req.session.redirectTo);
                }
                else {
                    console.log("register.handler adminUser rootPath", adminUser, rootPath);
                    return res.send({ "redirectTo": "/admin" });
                }
            });
        }
        else {
            const login = await admin.renderRegister({
                action: admin.options.loginPath,
                errorMessage: "invalidCredentials",
            });
            return res.send(login);
        }
    });
    async function verify(token) {
        const client = new OAuth2Client();
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userSub = payload['sub'];
        const email = payload['email'];
        console.log("register.handler verify payload", payload);
        return [email, userSub];
    }
};
