
import { PremiumModel } from '../shared/schema/PremiumSchema';
import StripeService from '../services/StripeService';
import { TRPCError } from '@trpc/server';
import z from 'zod';
import { getPlanFromTag } from '../shared/data/PLANS';

export const ZGetInvoicesInput = z.object({
    user_id: z.string()
})

export type TGetInvoicesInput = z.infer<typeof ZGetInvoicesInput>;


export async function getInvoices(data: TGetInvoicesInput) {
    try {
        const premiumData = await PremiumModel.findOne({ user_id: data.user_id });
        if (!premiumData) throw new TRPCError({ code: 'NOT_FOUND', message: 'Cannot find user. Please contact support.' });
        if (!premiumData.customer_id) throw new TRPCError({ code: 'NOT_FOUND', message: 'Cannot find user customer. Please contact support.' });
        const invoices = await StripeService.getInvoices(premiumData.customer_id);
        return invoices;
    } catch (ex) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: ex.message });
    }
}


export const ZCreateInvoiceInput = z.object({
    user_id: z.string(),
    customer_id: z.string(),
})

export type TCreateInvoiceInput = z.infer<typeof ZCreateInvoiceInput>;

export async function createInvoice(data: TCreateInvoiceInput) {
    try {

        const premiumData = await PremiumModel.findOne({ user_id: data.user_id, customer_id: data.customer_id });
        if (!premiumData) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Cannot find premium data' });

        const invoice = await StripeService.createInvoice(premiumData.customer_id);
        if (!invoice) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Cannot create preview' });

        return invoice;

    } catch (ex) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: ex.message });
    }
}