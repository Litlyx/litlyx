import { TransactionalEmailsApi, SendSmtpEmail } from '@getbrevo/brevo';
import { WELCOME_EMAIL } from './email_templates/WelcomeEmail';
import { LIMIT_50_EMAIL } from './email_templates/Limit50Email';
import { LIMIT_90_EMAIL } from './email_templates/Limit90Email';
import { LIMIT_MAX_EMAIL } from './email_templates/LimitMaxEmail';
import { PURCHASE_EMAIL } from './email_templates/PurchaseEmail';
import { ANOMALY_VISITS_EVENTS_EMAIL } from './email_templates/AnomalyUsageEmail';
import { ANOMALY_DOMAIN_EMAIL } from './email_templates/AnomalyDomainEmail';
import { CONFIRM_EMAIL } from './email_templates/ConfirmEmail';

class EmailService {

    private apiInstance = new TransactionalEmailsApi();

    init(apiKey: string) {
        this.apiInstance.setApiKey(0, apiKey);
    }

    async sendLimitEmail50(target: string, projectName: string) {
        try {
            const sendSmtpEmail = new SendSmtpEmail();
            sendSmtpEmail.subject = "You've reached 50% limit on Litlyx";
            sendSmtpEmail.sender = { "name": "Litlyx", "email": "help@litlyx.com" };
            sendSmtpEmail.to = [{ "email": target }];

            sendSmtpEmail.htmlContent = LIMIT_50_EMAIL
                .replace(/\[Project Name\]/, projectName)
                .toString();

            await this.apiInstance.sendTransacEmail(sendSmtpEmail);
            return true;
        } catch (ex) {
            console.error('ERROR SENDING EMAIL', ex);
            return false;
        }
    }

    async sendLimitEmail90(target: string, projectName: string) {
        try {
            const sendSmtpEmail = new SendSmtpEmail();
            sendSmtpEmail.subject = "You've reached 90% limit on Litlyx";
            sendSmtpEmail.sender = { "name": "Litlyx", "email": "help@litlyx.com" };
            sendSmtpEmail.to = [{ "email": target }];
            sendSmtpEmail.htmlContent = LIMIT_90_EMAIL
                .replace(/\[Project Name\]/, projectName)
                .toString();
            await this.apiInstance.sendTransacEmail(sendSmtpEmail);
            return true;
        } catch (ex) {
            console.error('ERROR SENDING EMAIL', ex);
            return false;
        }
    }

    async sendLimitEmailMax(target: string, projectName: string) {
        try {
            const sendSmtpEmail = new SendSmtpEmail();
            sendSmtpEmail.subject = "You've reached your limit on Litlyx!";
            sendSmtpEmail.sender = { "name": "Litlyx", "email": "help@litlyx.com" };
            sendSmtpEmail.to = [{ "email": target }];
            sendSmtpEmail.htmlContent = LIMIT_MAX_EMAIL
                .replace(/\[Project Name\]/, projectName)
                .toString();
            await this.apiInstance.sendTransacEmail(sendSmtpEmail);
            return true;
        } catch (ex) {
            console.error('ERROR SENDING EMAIL', ex);
            return false;
        }
    }

    async sendWelcomeEmail(target: string) {
        try {
            const sendSmtpEmail = new SendSmtpEmail();
            sendSmtpEmail.subject = "Welcome to Litlyx!";
            sendSmtpEmail.sender = { "name": "Litlyx", "email": "help@litlyx.com" };
            sendSmtpEmail.to = [{ "email": target }];
            sendSmtpEmail.htmlContent = WELCOME_EMAIL;
            await this.apiInstance.sendTransacEmail(sendSmtpEmail);
            return true;
        } catch (ex) {
            console.error('ERROR SENDING EMAIL', ex);
            return false;
        }
    }

    async sendPurchaseEmail(target: string, projectName: string) {
        try {
            const sendSmtpEmail = new SendSmtpEmail();
            sendSmtpEmail.subject = "Thank You for Upgrading Your Litlyx Plan!";
            sendSmtpEmail.sender = { "name": "Litlyx", "email": "help@litlyx.com" };
            sendSmtpEmail.to = [{ "email": target }];
            sendSmtpEmail.htmlContent = PURCHASE_EMAIL
                .replace(/\[Project Name\]/, projectName)
                .toString();
            await this.apiInstance.sendTransacEmail(sendSmtpEmail);
            return true;
        } catch (ex) {
            console.error('ERROR SENDING EMAIL', ex);
            return false;
        }
    }

    async sendAnomalyVisitsEventsEmail(target: string, projectName: string,
        data: {
            visits: { _id: string, count: number }[],
            events: { _id: string, count: number }[]
        }) {
        try {
            const sendSmtpEmail = new SendSmtpEmail();
            sendSmtpEmail.subject = "🚨 Unexpected Activity Detected by our AI";
            sendSmtpEmail.sender = { "name": "Litlyx", "email": "help@litlyx.com" };
            sendSmtpEmail.to = [{ "email": target }];
            sendSmtpEmail.htmlContent = ANOMALY_VISITS_EVENTS_EMAIL
                .replace(/\[Project Name\]/, projectName)
                .replace(/\[ENTRIES\]/,
                    [
                        ...data.visits.map(e => (`<li> Visits in date ${e._id} [ ${e.count} ] </li>`)),
                        ...data.events.map(e => (`<li> Events in date ${e._id} [ ${e.count} ] </li>`))
                    ]
                        .join('<br>')
                )
                .toString();
            await this.apiInstance.sendTransacEmail(sendSmtpEmail);
            return true;
        } catch (ex) {
            console.error('ERROR SENDING EMAIL', ex);
            return false;
        }
    }

    async sendAnomalyDomainEmail(target: string, projectName: string, domains: string[]) {
        try {
            const sendSmtpEmail = new SendSmtpEmail();
            sendSmtpEmail.subject = "🚨 Anomaly detected by our AI";
            sendSmtpEmail.sender = { "name": "Litlyx", "email": "help@litlyx.com" };
            sendSmtpEmail.to = [{ "email": target }];
            sendSmtpEmail.htmlContent = ANOMALY_DOMAIN_EMAIL
                .replace(/\[Project Name\]/, projectName)
                .replace(/\[CURRENT_DATE\]/, new Date().toLocaleDateString('en-EN'))
                .replace(/\[DNS_ENTRIES\]/,
                    domains.map(e => (`<li> ${e} </li>`)).join('<br>')
                )
                .toString();
            await this.apiInstance.sendTransacEmail(sendSmtpEmail);
            return true;
        } catch (ex) {
            console.error('ERROR SENDING EMAIL', ex);
            return false;
        }
    }


    async sendConfirmEmail(target: string, link: string) {
        try {
            const sendSmtpEmail = new SendSmtpEmail();
            sendSmtpEmail.subject = "Confirm your email";
            sendSmtpEmail.sender = { "name": "Litlyx", "email": "no-reply@litlyx.com" };
            sendSmtpEmail.to = [{ "email": target }];
            sendSmtpEmail.htmlContent = CONFIRM_EMAIL
                .replace(/\[CONFIRM_LINK\]/, link)
                .toString();
            await this.apiInstance.sendTransacEmail(sendSmtpEmail);
            return true;
        } catch (ex) {
            console.error('ERROR SENDING EMAIL', ex);
            return false;
        }
    }

}

const instance = new EmailService();
export default instance;