import { TransactionalEmailsApi, SendSmtpEmail } from '@getbrevo/brevo';
import { WELCOME_EMAIL } from './email_templates/WelcomeEmail';
import { LIMIT_50_EMAIL } from './email_templates/Limit50Email';


class EmailService {

    private apiInstance = new TransactionalEmailsApi();

    init(apiKey: string) {
        this.apiInstance.setApiKey(0, apiKey);
    }

    async sendLimitEmail50(target: string) {
        try {
            const sendSmtpEmail = new SendSmtpEmail();
            sendSmtpEmail.subject = "Litlyx project limit 50%";
            sendSmtpEmail.sender = { "name": "Litlyx", "email": "no-reply@litlyx.com" };
            sendSmtpEmail.to = [{ "email": target }];
            sendSmtpEmail.htmlContent = LIMIT_50_EMAIL;
            await this.apiInstance.sendTransacEmail(sendSmtpEmail);
            return true;
        } catch (ex) {
            console.error('ERROR SENDING EMAIL', ex);
            return false;
        }
    }

    async sendWelcomeEmail(target: string) {
        try {
            console.log('SENDING WELCOME EMAIL_EMAIL SERVICE')
            const sendSmtpEmail = new SendSmtpEmail();
            sendSmtpEmail.subject = "Welcome to Litlyx";
            sendSmtpEmail.sender = { "name": "Litlyx", "email": "no-reply@litlyx.com" };
            sendSmtpEmail.to = [{ "email": target }];
            sendSmtpEmail.htmlContent = WELCOME_EMAIL;
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