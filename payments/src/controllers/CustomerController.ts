
import { PremiumModel } from '../shared/schema/PremiumSchema';
import StripeService from '../services/StripeService';
import { TRPCError } from '@trpc/server';
import z from 'zod';

export const ZGetCustomerInput = z.object({
    user_id: z.string()
})

export type TGetCustomerInput = z.infer<typeof ZGetCustomerInput>;

export async function getCustomer(data: TGetCustomerInput) {
    const premiumData = await PremiumModel.findOne({ user_id: data.user_id });
    if (!premiumData) throw new TRPCError({ code: 'NOT_FOUND', message: 'Cannot find user. Please contact support.' });
    if (!premiumData.customer_id) throw new TRPCError({ code: 'NOT_FOUND', message: 'Cannot find user customer. Please contact support.' });
    const customer = await StripeService.getCustomer(premiumData.customer_id);
    if (!customer) throw new TRPCError({ code: 'NOT_FOUND', message: 'Cannot find customer. Please contact support.' });
    if (customer.deleted === true) throw new TRPCError({ code: 'NOT_FOUND', message: 'Customer is deleted. Please contact support.' });
    return customer.address;
}

export const ZUpdateCustomerInput = z.object({
    user_id: z.string(),
    address: z.object({
        line1: z.string(),
        line2: z.string(),
        country: z.string(),
        postal_code: z.string(),
        city: z.string(),
        state: z.string()
    })
})

export type TUpdateCustomerInput = z.infer<typeof ZUpdateCustomerInput>;

export async function updateCustomer(data: TUpdateCustomerInput) {
    try {
        const premiumData = await PremiumModel.findOne({ user_id: data.user_id });
        if (!premiumData) throw new TRPCError({ code: 'NOT_FOUND', message: 'User premium data not found. Please contact support.' });
        if (!premiumData.customer_id) throw new TRPCError({ code: 'NOT_FOUND', message: 'Cannot find user customer. Please contact support.' });
        await StripeService.setCustomerInfo(premiumData.customer_id, data.address);
        return { ok: true }
    } catch (ex) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: ex.message });
    }
}

export const ZCreateCustomerInput = z.object({
    email: z.string()
})

export type TCreateCustomerInput = z.infer<typeof ZCreateCustomerInput>;

export async function createCustomer(data: TCreateCustomerInput) {
    try {
        const customer = await StripeService.createCustomer(data.email);
        if (!customer) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Cannot create customer. Please contact support.' });
        return { ok: true, customer_id: customer.id }
    } catch (ex) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: ex.message });
    }
}

export const ZDeleteCustomerInput = z.object({
    customer_id: z.string()
})

export type TDeleteCustomerInput = z.infer<typeof ZDeleteCustomerInput>;

export async function deleteCustomer(data: TDeleteCustomerInput) {
    try {
        const premiumData = await PremiumModel.findOne({ customer_id: data.customer_id });
        if (!premiumData) throw new TRPCError({ code: 'NOT_FOUND', message: 'User premium data not found. Please contact support.' });
        await StripeService.deleteCustomer(data.customer_id);
        return { ok: true }
    } catch (ex) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: ex.message });
    }
}


export const ZListCustomerPaymentMethodsInput = z.object({
    customer_id: z.string()
})

export type TListCustomerPaymentMethodsInput = z.infer<typeof ZListCustomerPaymentMethodsInput>;

export async function listCustomerPaymentMethods(data: TListCustomerPaymentMethodsInput) {
    try {
        const premiumData = await PremiumModel.findOne({ customer_id: data.customer_id });
        if (!premiumData) throw new TRPCError({ code: 'NOT_FOUND', message: 'User premium data not found. Please contact support.' });
        const methods = await StripeService.getCustomerPaymentMethods(data.customer_id);
        return methods;
    } catch (ex) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: ex.message });
    }
}
