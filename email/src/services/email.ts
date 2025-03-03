import { TransactionalEmailsApi, SendSmtpEmail, ContactsApi } from '@getbrevo/brevo';
import * as TEMPLATE from './templates'

export class EmailService {

    private static apiInstance = new TransactionalEmailsApi();
    private static apiContacts = new ContactsApi();

    static init(apiKey: string) {
        this.apiInstance.setApiKey(0, apiKey);
        this.apiContacts.setApiKey(0, apiKey);
    }

    static async sendInviteEmail(target: string, projectName: string, link: string) {
        try {
            const sendSmtpEmail = new SendSmtpEmail();
            sendSmtpEmail.subject = "⚡ Invite";
            sendSmtpEmail.sender = { "name": "Litlyx", "email": "help@litlyx.com" };
            sendSmtpEmail.to = [{ "email": target }];

            sendSmtpEmail.htmlContent = TEMPLATE.PROJECT_INVITE_EMAIL
                .replace(/\[Project Name\]/, projectName)
                .replace(/\[Link\]/, link)
                .toString();

            await this.apiInstance.sendTransacEmail(sendSmtpEmail);
            return true;
        } catch (ex) {
            console.error('ERROR SENDING EMAIL', ex);
            return false;
        }
    }

    static async sendInviteEmailNoAccount(target: string, projectName: string, link: string) {
        try {
            const sendSmtpEmail = new SendSmtpEmail();
            sendSmtpEmail.subject = "⚡ Invite - No account";
            sendSmtpEmail.sender = { "name": "Litlyx", "email": "help@litlyx.com" };
            sendSmtpEmail.to = [{ "email": target }];

            sendSmtpEmail.htmlContent = TEMPLATE.PROJECT_INVITE_EMAIL_NO_ACCOUNT
                .replace(/\[Project Name\]/, projectName)
                .replace(/\[Link\]/, link)
                .toString();

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
        } catch (ex) {
            console.error('ERROR ADDING CONTACT', ex);
            return false;
        }
    }

    static async sendLimitEmail50(target: string, projectName: string) {
        try {
            const sendSmtpEmail = new SendSmtpEmail();
            sendSmtpEmail.subject = "⚡ You've reached 50% limit on Litlyx";
            sendSmtpEmail.sender = { "name": "Litlyx", "email": "help@litlyx.com" };
            sendSmtpEmail.to = [{ "email": target }];

            sendSmtpEmail.htmlContent = TEMPLATE.LIMIT_50_EMAIL
                .replace(/\[Project Name\]/, projectName)
                .toString();

            await this.apiInstance.sendTransacEmail(sendSmtpEmail);
            return true;
        } catch (ex) {
            console.error('ERROR SENDING EMAIL', ex);
            return false;
        }
    }

    static async sendLimitEmail90(target: string, projectName: string) {
        try {
            const sendSmtpEmail = new SendSmtpEmail();
            sendSmtpEmail.subject = "⚡ You've reached 90% limit on Litlyx";
            sendSmtpEmail.sender = { "name": "Litlyx", "email": "help@litlyx.com" };
            sendSmtpEmail.to = [{ "email": target }];
            sendSmtpEmail.htmlContent = TEMPLATE.LIMIT_90_EMAIL
                .replace(/\[Project Name\]/, projectName)
                .toString();
            await this.apiInstance.sendTransacEmail(sendSmtpEmail);
            return true;
        } catch (ex) {
            console.error('ERROR SENDING EMAIL', ex);
            return false;
        }
    }

    static async sendLimitEmailMax(target: string, projectName: string) {
        try {
            const sendSmtpEmail = new SendSmtpEmail();
            sendSmtpEmail.subject = "🚨 You've reached your limit on Litlyx!";
            sendSmtpEmail.sender = { "name": "Litlyx", "email": "help@litlyx.com" };
            sendSmtpEmail.to = [{ "email": target }];
            sendSmtpEmail.htmlContent = TEMPLATE.LIMIT_MAX_EMAIL
                .replace(/\[Project Name\]/, projectName)
                .toString();
            await this.apiInstance.sendTransacEmail(sendSmtpEmail);
            return true;
        } catch (ex) {
            console.error('ERROR SENDING EMAIL', ex);
            return false;
        }
    }

    static async sendWelcomeEmail(target: string) {
        try {
            const sendSmtpEmail = new SendSmtpEmail();
            sendSmtpEmail.subject = "Welcome to Litlyx!";
            sendSmtpEmail.sender = { "name": "Litlyx", "email": "help@litlyx.com" };
            sendSmtpEmail.to = [{ "email": target }];
            sendSmtpEmail.htmlContent = TEMPLATE.WELCOME_EMAIL;
            await this.apiInstance.sendTransacEmail(sendSmtpEmail);
            return true;
        } catch (ex) {
            console.error('ERROR SENDING EMAIL', ex);
            return false;
        }
    }

    static async sendPurchaseEmail(target: string, projectName: string) {
        try {
            const sendSmtpEmail = new SendSmtpEmail();
            sendSmtpEmail.subject = "Thank You for Upgrading Your Litlyx Plan!";
            sendSmtpEmail.sender = { "name": "Litlyx", "email": "help@litlyx.com" };
            sendSmtpEmail.to = [{ "email": target }];
            sendSmtpEmail.htmlContent = TEMPLATE.PURCHASE_EMAIL
                .replace(/\[Project Name\]/, projectName)
                .toString();
            await this.apiInstance.sendTransacEmail(sendSmtpEmail);
            return true;
        } catch (ex) {
            console.error('ERROR SENDING EMAIL', ex);
            return false;
        }
    }

    static async sendAnomalyVisitsEventsEmail(target: string, projectName: string,
        data: {
            visits: { _id: string, count: number }[],
            events: { _id: string, count: number }[]
        }) {
        try {
            const sendSmtpEmail = new SendSmtpEmail();
            sendSmtpEmail.subject = "🔍 Unexpected Activity Detected by our AI";
            sendSmtpEmail.sender = { "name": "Litlyx", "email": "help@litlyx.com" };
            sendSmtpEmail.to = [{ "email": target }];
            sendSmtpEmail.htmlContent = TEMPLATE.ANOMALY_VISITS_EVENTS_EMAIL
                .replace(/\[Project Name\]/, projectName)
                .replace(/\[ENTRIES\]/,
                    [
                        ...data.visits.map(e => (`<li> Visits in date ${new Date(e._id).toLocaleDateString('en-EN')} [ ${e.count} ] </li>`)),
                        ...data.events.map(e => (`<li> Events in date ${new Date(e._id).toLocaleDateString('en-EN')} [ ${e.count} ] </li>`))
                    ]
                        .join('')
                )
                .toString();
            await this.apiInstance.sendTransacEmail(sendSmtpEmail);
            return true;
        } catch (ex) {
            console.error('ERROR SENDING EMAIL', ex);
            return false;
        }
    }

    static async sendAnomalyDomainEmail(target: string, projectName: string, domains: string[]) {
        try {
            const sendSmtpEmail = new SendSmtpEmail();
            sendSmtpEmail.subject = "🔍 Suspicious dns detected by our AI";
            sendSmtpEmail.sender = { "name": "Litlyx", "email": "help@litlyx.com" };
            sendSmtpEmail.to = [{ "email": target }];
            sendSmtpEmail.htmlContent = TEMPLATE.ANOMALY_DOMAIN_EMAIL
                .replace(/\[Project Name\]/, projectName)
                .replace(/\[CURRENT_DATE\]/, new Date().toLocaleDateString('en-EN'))
                // .replace(/\[DNS_ENTRIES\]/,
                //     domains.map(e => (`<li> ${e} </li>`)).join('<br>')
                .replace(/\[DNS_ENTRIES\]/, domains[0])
                .toString();
            await this.apiInstance.sendTransacEmail(sendSmtpEmail);
            return true;
        } catch (ex) {
            console.error('ERROR SENDING EMAIL', ex);
            return false;
        }
    }


    static async sendConfirmEmail(target: string, link: string) {
        try {
            const sendSmtpEmail = new SendSmtpEmail();
            sendSmtpEmail.subject = "Confirm your email";
            sendSmtpEmail.sender = { "name": "Litlyx", "email": "no-reply@litlyx.com" };
            sendSmtpEmail.to = [{ "email": target }];
            sendSmtpEmail.htmlContent = TEMPLATE.CONFIRM_EMAIL
                .replace(/\[CONFIRM_LINK\]/, link)
                .toString();
            await this.apiInstance.sendTransacEmail(sendSmtpEmail);
            return true;
        } catch (ex) {
            console.error('ERROR SENDING EMAIL', ex);
            return false;
        }
    }

    static async sendResetPasswordEmail(target: string, newPassword: string) {
        try {
            const sendSmtpEmail = new SendSmtpEmail();
            sendSmtpEmail.subject = "Password reset";
            sendSmtpEmail.sender = { "name": "Litlyx", "email": "no-reply@litlyx.com" };
            sendSmtpEmail.to = [{ "email": target }];
            sendSmtpEmail.htmlContent = TEMPLATE.RESET_PASSWORD_EMAIL
                .replace(/\[NEW_PASSWORD\]/, newPassword)
                .toString();
            await this.apiInstance.sendTransacEmail(sendSmtpEmail);
            return true;
        } catch (ex) {
            console.error('ERROR SENDING EMAIL', ex);
            return false;
        }
    }


}
