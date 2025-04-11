import express from 'express';
import cors from 'cors';
import { EmailService } from './email';

const TOKEN = process.env.TOKEN;

if (!TOKEN || TOKEN.length == 0) {
    console.log('TOKEN not set');
    process.exit();
}

const PORT = process.env.PORT;

if (!PORT || PORT.length == 0) {
    console.log('PORT not set');
    process.exit();
}

const BREVO_API_KEY = process.env.BREVO_API_KEY;

if (!BREVO_API_KEY || BREVO_API_KEY.length == 0) {
    console.log('BREVO_API_KEY not set');
    process.exit();
}

EmailService.init(BREVO_API_KEY);

const app = express();
app.use(cors());

app.use((req, res, next) => {
    const token = req.header('x-litlyx-token');
    if (token != TOKEN) {
        res.status(403).json({ error: 'token not valid' });
        return;
    }
    console.log(req.path);
    next();
});

app.post('/send/invite', express.json(), async (req, res) => {
    try {
        const { target, projectName, link } = req.body;
        const ok = await EmailService.sendInviteEmail(target, projectName, link);
        res.json({ ok });
    } catch (ex) {
        res.status(500).json({ error: ex.message });
    }
});

app.post('/send/invite/noaccount', express.json(), async (req, res) => {
    try {
        const { target, projectName, link } = req.body;
        const ok = await EmailService.sendInviteEmailNoAccount(target, projectName, link);
        res.json({ ok });
    } catch (ex) {
        res.status(500).json({ error: ex.message });
    }
});

app.post('/send/brevolist/add', express.json(), async (req, res) => {
    try {
        const { email } = req.body;
        const ok = await EmailService.createContact(email);
        res.json({ ok });
    } catch (ex) {
        res.status(500).json({ error: ex.message });
    }
});

app.post('/send/confirm', express.json(), async (req, res) => {
    try {
        const { target, link } = req.body;
        const ok = await EmailService.sendConfirmEmail(target, link);
        res.json({ ok });
    } catch (ex) {
        res.status(500).json({ error: ex.message });
    }
});

app.post('/send/welcome', express.json(), async (req, res) => {
    try {
        const { target } = req.body;
        const ok = await EmailService.sendWelcomeEmail(target);
        res.json({ ok });
    } catch (ex) {
        res.status(500).json({ error: ex.message });
    }
});

app.post('/send/purchase', express.json(), async (req, res) => {
    try {
        const { target } = req.body;
        const ok = await EmailService.sendPurchaseEmail(target);
        res.json({ ok });
    } catch (ex) {
        res.status(500).json({ error: ex.message });
    }
});

app.post('/send/reset_password', express.json(), async (req, res) => {
    try {
        const { target, newPassword } = req.body;
        const ok = await EmailService.sendResetPasswordEmail(target, newPassword);
        res.json({ ok });
    } catch (ex) {
        res.status(500).json({ error: ex.message });
    }
});

app.post('/send/anomaly/domain', express.json(), async (req, res) => {
    try {
        const { target, projectName, domains } = req.body;
        const ok = await EmailService.sendAnomalyDomainEmail(target, projectName, domains);
        res.json({ ok });
    } catch (ex) {
        res.status(500).json({ error: ex.message });
    }
});

app.post('/send/anomaly/visits_events', express.json(), async (req, res) => {
    try {
        const { target, projectName, data } = req.body;
        const ok = await EmailService.sendAnomalyVisitsEventsEmail(target, projectName, data);
        res.json({ ok });
    } catch (ex) {
        res.status(500).json({ error: ex.message });
    }
});

app.post('/send/limit/50', express.json(), async (req, res) => {
    try {
        const { target } = req.body;
        const ok = await EmailService.sendLimitEmail50(target);
        res.json({ ok });
    } catch (ex) {
        res.status(500).json({ error: ex.message });
    }
});

app.post('/send/limit/90', express.json(), async (req, res) => {
    try {
        const { target } = req.body;
        const ok = await EmailService.sendLimitEmail90(target);
        res.json({ ok });
    } catch (ex) {
        res.status(500).json({ error: ex.message });
    }
});

app.post('/send/limit/max', express.json(), async (req, res) => {
    try {
        const { target } = req.body;
        const ok = await EmailService.sendLimitEmailMax(target);
        res.json({ ok });
    } catch (ex) {
        res.status(500).json({ error: ex.message });
    }
});

export function start() {
    const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    return { app, server };
}