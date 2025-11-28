import { TransactionalEmailsApi, SendSmtpEmail, ContactsApi } from '@getbrevo/brevo';
import { EMAIL_TEMPLATE_NAME, EMAIL_TEMPLATES, EMAIL_TEMPLATES as TEMPLATE } from './TemplateService'



export type SendEmailOptions<Keys extends string[] = any> = {
    target: string,
    subject: string,
    params: Record<Keys[number], string>,
    template: EMAIL_TEMPLATE_NAME
}

export class EmailService {

    private static apiInstance = new TransactionalEmailsApi();
    private static apiContacts = new ContactsApi();

    static init(apiKey: string) {
        this.apiInstance.setApiKey(0, apiKey);
        this.apiContacts.setApiKey(0, apiKey);
    }


    static async sendGenericEmail<Keys extends string[]>(options: SendEmailOptions<Keys>) {
        try {
            const sendSmtpEmail = new SendSmtpEmail();
            sendSmtpEmail.subject = options.subject;
            sendSmtpEmail.sender = { "name": "Litlyx", "email": "help@litlyx.com" };
            sendSmtpEmail.to = [{ "email": options.target }];
            const templateContent = EMAIL_TEMPLATES[options.template];
            let templateResult = templateContent;

            const paramKeys = Object.keys(options.params);

            for (const paramKey of paramKeys) {
                const regexp = new RegExp(`\\[${paramKey}\\]`);
                templateResult = templateResult.replace(regexp, options.params[paramKey]);
            }

            templateResult = templateResult.toString();
            sendSmtpEmail.htmlContent = templateResult;


            await this.apiInstance.sendTransacEmail(sendSmtpEmail);
            return true;
        } catch (ex) {
            console.error('ERROR SENDING EMAIL', ex);
            return false;
        }
    }

    static async createContact(email: string) {
        try {
            await this.apiContacts.createContact({ email });
            await this.apiContacts.addContactToList(12, { emails: [email] })
            return true;
        } catch (ex) {
            console.error('ERROR ADDING CONTACT', ex);
            return false;
        }
    }

}
