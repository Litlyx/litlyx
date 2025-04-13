import { Redis } from "~/server/services/CacheService";
import { PaymentServiceHelper } from "~/server/services/PaymentServiceHelper";
import { PremiumModel } from "~/shared/schema/PremiumSchema";

export type InvoiceData = {
    date: number,
    cost: number,
    id: string,
    status: string,
    link: string
}

export default defineEventHandler(async event => {
    const data = await getRequestData(event, []);
    if (!data) return;


    return await Redis.useCache({ key: `invoices:${data.user.id}`, exp: 10 }, async () => {

        const premium = await PremiumModel.findOne({ user_id: data.user.id });
        if (!premium) return [];

        const [ok, invoicesOrError] = await PaymentServiceHelper.invoices_list(data.user.id);
        if (!ok) {
            console.error(invoicesOrError);
            return [];
        }

        return invoicesOrError.invoices.map(e => {
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