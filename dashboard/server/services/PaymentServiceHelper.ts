
const { PAYMENT_SECRET } = useRuntimeConfig();

type ErrorResponse = [false, Error];
type OkResponse<T> = [true, T];

type PaymentServiceResponse<T> = Promise<OkResponse<T> | ErrorResponse>

export class PaymentServiceHelper {

    static BASE_URL = 'https://payments.litlyx.com/payment';

    private static async send(endpoint: string, body: Record<string, any>): PaymentServiceResponse<any> {
        try {
            const res = await $fetch(`${this.BASE_URL}${endpoint}`, {
                body: JSON.stringify(body),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-litlyx-token': PAYMENT_SECRET
                }
            })
            return [true, res];
        } catch (ex: any) {
            console.log('---')
            console.log(ex.response?._data);
            console.log('---')
            console.error(ex);
            return [false, ex];
        }
    }

    static async create_customer(user_id: string): PaymentServiceResponse<{ ok: true }> {
        return await this.send('/create_customer', { user_id });
    }

    static async create_subscription(user_id: string, plan_tag: string): PaymentServiceResponse<{ ok: true }> {
        return await this.send('/create_subscription', { user_id, plan_tag });
    }

    static async create_payment(user_id: string, plan_id: number): PaymentServiceResponse<{ url: string }> {
        return await this.send('/create_payment', { user_id, plan_id });
    }

    static async invoices_list(user_id: string): PaymentServiceResponse<{ invoices: any[] }> {
        return await this.send('/invoices_list', { user_id });
    }

    static async customer_info(user_id: string): PaymentServiceResponse<any> {
        return await this.send('/customer_info', { user_id });
    }

    static async update_customer_info(user_id: string, address: { line1: string, line2: string, city: string, country: string, postal_code: string, state: string }): PaymentServiceResponse<{ ok: true }> {
        return await this.send('/update_customer_info', { user_id, address });
    }

    static async delete_customer(customer_id: string): PaymentServiceResponse<{ ok: true }> {
        return await this.send('/delete_customer', { customer_id });
    }

}