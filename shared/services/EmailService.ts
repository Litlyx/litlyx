import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { WELCOME_EMAIL } from './email_templates/WelcomeEmail';




const TemplateEmail50 = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LitLyx Limit Reached Email</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

        body {
            font-family: 'Poppins', sans-serif;
            background-color: #0a0a0a;
            color: #ffffff;
            margin: 0;
            padding: 0;
        }

        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            text-align: center;
            padding: 20px 0;
        }

        .header h1 {
            font-size: 36px;
            font-weight: 700;
            margin: 0;
        }

        .step {
            margin: 20px 0;
            text-align: center;
        }

        .step h2 {
            font-size: 24px;
            font-weight: 600;
            margin: 0 0 10px 0;
        }

        .step p {
            font-size: 16px;
            font-weight: 300;
            margin: 0 0 20px 0;
        }

        .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            font-weight: 600;
            color: #ffffff;
            background-color: #1a73e8;
            text-decoration: none;
            border-radius: 5px;
        }

        .footer {
            text-align: center;
            padding: 20px 0;
            font-size: 14px;
            font-weight: 300;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>⚠ Limit for project ⚠</h1>
        </div>
        <div class="header">
            <p>Hey there! We found that one of your projects is at 50% of the <strong>limit of the plan.</strong> In order to continue to log visits & events, you should upgrade the plan of your project!</p>
        </div>
        <div class="step" style="margin-top: 4rem;">
            <h2>How can I upgrade the plan?</h2>
            <p>We offer different plans, each of them follows the stage of your project, so based on the reach, you should upgrade to the most appropriate one for your web platform.<strong> It takes 1 minute to upgrade the plan!</strong> You can find everything in the "Billing" section in the left menu of your dashboard.</p>
            <a href="https://dashboard.litlyx.com" class="button">Visit your dashboard</a>
        </div>
        <div class="step" style="margin-top: 4rem;">
            <h2>We are in early phases!</h2>
            <p>Want to become an early adopter? Book a demo with me! I'm Antonio & I'll guide you through all the features and benefits of LitLyx.<strong> A big discount is waiting for you❗️❗️❗️</strong></p>
            <a href="https://cal.com/litlyx/30min" class="button">Book a Demo with Me!</a>
        </div>
        <div class="footer">
            <p>Thank you for choosing LitLyx each day to keep track of your business KPIs!</p>
            <p>Made with ❤️ in Italy</p>
        </div>
    </div>
</body>

</html>
`

class EmailService {

    private transport: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

    createTransport(service: string, host: string, user: string, pass: string) {
        this.transport = nodemailer.createTransport({
            host,
            secure: true,
            auth: { user, pass },
            tls: {
                minVersion: 'TLSv1',
                ciphers: 'HIGH:MEDIUM:!aNULL:!eNULL:@STRENGTH:!DH:!kEDH'
            }
        });
    }

    async sendLimitEmail50(target: string) {
        try {
            if (!this.transport) return console.error('Transport not created');
            await this.transport.sendMail({
                from: 'helplitlyx@gmail.com',
                to: target,
                subject: 'Project limit 50%',
                html: TemplateEmail50
            });
            return true;
        } catch (ex) {
            console.error('ERROR SENDING EMAIL', ex);
            return false;
        }
    }

    async sendWelcomeEmail(target: string) {
        try {
            if (!this.transport) return console.error('Transport not created');
            await this.transport.sendMail({
                from: 'helplitlyx@gmail.com',
                to: target,
                subject: 'Welcome to Litlyx',
                html: WELCOME_EMAIL
            });
            return true;
        } catch (ex) {
            console.error('ERROR SENDING EMAIL', ex);
            return false;
        }
    }

}

const instance = new EmailService();
export default instance;