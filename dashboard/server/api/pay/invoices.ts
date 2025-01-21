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
    const data = await getRequestDataOld(event, { requireSchema: false, allowLitlyx: false });
    if (!data) return;

    const { project, pid } = data;

    if (!project.customer_id) return [];

    return await Redis.useCache({ key: `invoices:${pid}`, exp: 10 }, async () => {

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