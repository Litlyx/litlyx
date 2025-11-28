import { protectedProcedure, router } from '../trpc';
import { createCustomer, deleteCustomer, getCustomer, listCustomerPaymentMethods, updateCustomer, ZCreateCustomerInput, ZDeleteCustomerInput, ZGetCustomerInput, ZListCustomerPaymentMethodsInput, ZUpdateCustomerInput } from '../controllers/CustomerController';


export const customerRouter = router({
    update: protectedProcedure.input(ZUpdateCustomerInput).mutation(async (opts) => {
        const result = await updateCustomer(opts.input);
        return result;
    }),
    get: protectedProcedure.input(ZGetCustomerInput).query(async (opts) => {
        const address = await getCustomer(opts.input);
        let result = { line1: '', line2: '', city: '', country: '', postal_code: '', state: '' };
        result = { ...result, ...address } as any
        return result;
    }),
    create: protectedProcedure.input(ZCreateCustomerInput).mutation(async (opts) => {
        const result = await createCustomer(opts.input);
        return result;
    }),
    delete: protectedProcedure.input(ZDeleteCustomerInput).mutation(async (opts) => {
        const result = await deleteCustomer(opts.input);
        return result;
    }),
    listMethods: protectedProcedure.input(ZListCustomerPaymentMethodsInput).query(async (opts) => {
        const result = await listCustomerPaymentMethods(opts.input);
        return result;
    }),
});