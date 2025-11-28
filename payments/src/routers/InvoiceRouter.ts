import { protectedProcedure, router } from '../trpc';
import { getInvoices, ZGetInvoicesInput } from '../controllers/InvoiceController';


export const invoiceRouter = router({
    invoices: protectedProcedure.input(ZGetInvoicesInput).query(async (opts) => {
        const invoices = await getInvoices(opts.input);
        return invoices;
    }),
});