import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';
import { OAuth2Client } from "google-auth-library";
const getRegisterPath = (registerPath, admin) => {
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
    host: process.env.MAIL_SERVER,
    port: Number.parseInt(process.env.MAIL_PORT),
    secure: true,
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
});
const transporter = nodemailer.createTransport(opt);
async function sendEmail(from, to, subject, text, html) {
    const info = await transporter.sendMail({
        from: from, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body
    });
    console.log("Message sent: %s", info.messageId);
    return true;
}
export const withRegister = (registerPath, emailSentPath, confirmPath, gmailCallbackPath, router, admin, auth) => {
    const suffixRegPath = getRegisterPath(registerPath, admin);
    const suffixEmailSentPath = getRegisterPath(emailSentPath, admin);
    const suffixConfirmPath = getRegisterPath(confirmPath, admin);
    const suffixGmailCallbackPath = getRegisterPath(gmailCallbackPath, admin);
    //console.log("inside withRegister ")
    router.get(suffixRegPath, async (req, res) => {
        const baseProps = {
            action: registerPath,
            errorMessage: null,
        };
        //console.log("inside withRegister get")
        const register = await admin.renderRegister(Object.assign({}, baseProps));
        return res.send(register);
    });
    router.post(suffixRegPath, async (req, res, next) => {
        const context = { req, res };
        const { email, password, ou } = req.fields;
        let unconfUser = await auth.createUnconfUser(email, password, ou, context);
        let fullUrlPath = `${req.protocol}://${req.get('host')}${req.originalUrl}/confirm/`;
        //console.log("post unconfUser",unconfUser);
        // "auth.authenticate" must always be defined if "auth.provider" isn't
        //adminUser = await auth.authenticate!(email, password, context);
        if (unconfUser && typeof unconfUser === 'object') {
            let { conf_token } = unconfUser;
            let mailState = sendEmail(process.env.FMAIL_SENDER, email, process.env.MAIL_SUBJECT_PREFIX, "", `<p>Dear ${email},</p>
            <p>Welcome to <b>domain address</b>!</p>
            <p>To confirm your account please</p> 
            <p><a href="${fullUrlPath + conf_token}">click here</a>.</p>
            <p>Alternatively, you can paste the following link in your browser's address bar:</p>
            <p><a href="{{ url_for('auth_bp.confirm',_external=True, token=token) }}">
                {{ url_for('auth_bp.confirm',_external=True, token=token) }}</a></p>
            <p>Sincerely,</p>
            <p>The Team</p>
            <p><small>Note: replies to this email address are not monitored.</small></p>`);
            mailState.then(() => {
                req.session.email = email;
                req.session.unconfUser = unconfUser;
                req.session.save((err) => {
                    if (err) {
                        return next(err);
                    }
                    if (req.session.redirectTo) {
                        return res.redirect(302, req.session.redirectTo);
                    }
                    else {
                        return res.redirect(302, emailSentPath);
                    }
                });
            }).catch(() => {
                return res.redirect(302, registerPath);
            });
        }
        else {
            let baseProps = {
                action: registerPath,
                errorMessage: "Error in confirm initialisation",
            };
            if (unconfUser === 'user_exists') {
                baseProps = {
                    action: registerPath,
                    errorMessage: "User already exists",
                };
            }
            //console.log("inside withRegister get")
            const register = await admin.renderRegister(Object.assign({}, baseProps));
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
        const register = await admin.renderRegister(Object.assign({}, baseProps));
        return res.send(register);
    });
    router.get(suffixConfirmPath, async (req, res, next) => {
        const context = { req, res };
        const unconfUser = req.session.unconfUser;
        const { conf_token } = unconfUser;
        const reqConfToken = req.params.conf_token;
        let confUser = await auth.confUser(reqConfToken, unconfUser);
        console.log("register.handler confirmPath confUser", confUser);
        if (confUser) {
            req.session.adminUser = confUser;
            req.session.email = confUser['user_email'];
            req.session.save((err) => {
                if (err) {
                    return next(err);
                }
                if (req.session.redirectTo) {
                    return res.redirect(302, req.session.redirectTo);
                }
                else {
                    return res.redirect(302, admin.options.rootPath);
                }
            });
        }
        else {
            const register = await admin.renderRegister({
                action: registerPath,
                errorMessage: "Wrong confirmation link",
            });
            return res.send(register);
        }
    });
    router.post(suffixGmailCallbackPath, async (req, res, next) => {
        const context = { req, res };
        const { credential } = req.query;
        const { rootPath } = admin.options;
        verify(credential)
            .then(async ([email, google_sub]) => {
            let adminUser = await auth.authenticateGmailUser(email, google_sub);
            if (adminUser) {
                req.session.adminUser = adminUser;
                console.log("login.handler adminUser['user_email']", adminUser['user_email']);
                req.session.email = adminUser['user_email'];
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
            else {
                const login = await admin.renderRegister({
                    action: admin.options.loginPath,
                    errorMessage: "invalidCredentials",
                });
                return res.send(login);
            }
        })
            .catch((err) => console.log("register.handler verify error", err));
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
