
import { EmailServerInfo } from '@services/EmailService'

const { EMAIL_SECRET } = useRuntimeConfig();

export class EmailServiceHelper {
    static async sendEmail(data: EmailServerInfo) {
        try {
            await $fetch(data.url, {
                method: 'POST',
                body: JSON.stringify(data.body),
                headers: { ...data.headers, 'x-litlyx-token': EMAIL_SECRET }
            })
        } catch (ex) {
            console.error(ex);
        }
    }
}