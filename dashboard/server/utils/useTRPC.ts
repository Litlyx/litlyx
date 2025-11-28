import type { tRpcPaymentsType, tRpcEmailsType } from "~/server/plugins/trpc";


export function useTRPC() {

    const nitroApp = useNitroApp() as any;
    const payments = nitroApp.shared.tRpcPayments;
    const emails = nitroApp.shared.tRpcEmails;


    return {
        payments,
        emails
    } as {
        payments: tRpcPaymentsType,
        emails: tRpcEmailsType
    }

}