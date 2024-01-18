import AdminJS from '../adminjs.js';
export type RegisterTemplateAttributes = {
    errorMessage?: string | null;
    postMessage?: string;
    action?: string;
    [name: string]: any;
};
declare const html: (admin: AdminJS, attributes: RegisterTemplateAttributes) => Promise<string>;
export default html;
