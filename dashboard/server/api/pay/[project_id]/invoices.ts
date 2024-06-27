import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { Redis } from "~/server/services/CacheService";
import StripeService from '~/server/services/StripeService';


export type InvoiceData = {
    date: number,
    cost: number,
    id: string,
    status: string,
    link: string
}

export default defineEventHandler(async event => {

    const project_id = getRequestProjectId(event);
    if (!project_id) return;

    const user = getRequestUser(event);
    const project = await getUserProjectFromId(project_id, user, false);
    if (!project) return;

    if (!project.customer_id) return [];

    return await Redis.useCache({ key: `invoices:${project_id}`, exp: 10 }, async () => {

        const invoices = await StripeService.getInvoices(project.customer_id);
        if (!invoices) return [];

        return invoices?.data.map(e => {
            const result: InvoiceData = {
                link: e.invoice_pdf || '',
                id: e.number || '',
                date: e.created * 1000,
                status: e.status || 'NO_STATUS',
                cost: e.amount_due
            }
            return result;
        });


    });

});