const templateMap = {
    confirm: '/confirm',
    welcome: '/welcome',
    purchase: '/purchase',
    reset_password: '/reset_password',
    anomaly_domain: '/anomaly/domain',
    anomaly_visits_events: '/anomaly_visits_events',
    limit_50: '/limit/50',
    limit_90: '/limit/90',
    limit_max: '/limit/max',
    invite_project: '/invite',
    invite_project_noaccount: '/invite/noaccount',
    brevolist_add: '/brevolist/add'
} as const;

export type EmailTemplate = keyof typeof templateMap;
export type EmailServerInfo = { url: string, body: Record<string, any>, headers: Record<string, string> };

type EmailData =
    | { template: 'confirm', data: { target: string, link: string } }
    | { template: 'welcome', data: { target: string } }
    | { template: 'purchase', data: { target: string, projectName: string } }
    | { template: 'reset_password', data: { target: string, newPassword: string } }
    | { template: 'anomaly_domain', data: { target: string, projectName: string, domains: string[] } }
    | { template: 'anomaly_visits_events', data: { target: string, projectName: string, data: any[] } }
    | { template: 'limit_50', data: { target: string, projectName: string } }
    | { template: 'limit_90', data: { target: string, projectName: string } }
    | { template: 'limit_max', data: { target: string, projectName: string } }
    | { template: 'invite_project', data: { target: string, projectName: string, link: string } }
    | { template: 'invite_project_noaccount', data: { target: string, projectName: string, link: string } }
    | { template: 'brevolist_add', data: { email: string } }

export class EmailService {
    static getEmailServerInfo<T extends EmailTemplate>(template: T, data: Extract<EmailData, { template: T }>['data']): EmailServerInfo {
        return {
            url: `https://mail-service.litlyx.com/send${templateMap[template]}`,
            body: data,
            headers: { 'Content-Type': 'application/json' }
        };
    }
}