
import { EmailServerInfo } from './shared/services/EmailService'
import axios from 'axios';

const EMAIL_SECRET = process.env.EMAIL_SECRET;

export class EmailServiceHelper {
    static async sendEmail(data: EmailServerInfo) {
        try {
            await axios(data.url, {
                method: 'POST',
                data: data.body,
                headers: { ...data.headers, 'x-litlyx-token': EMAIL_SECRET }
            })
        } catch (ex) {
            console.error(ex);
        }
    }
}