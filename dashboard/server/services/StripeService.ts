import { getPlanFromTag } from '@data/PREMIUM';
import Stripe from 'stripe';

class StripeService {
    private stripe?: Stripe;
    private privateKey?: string;
    private webhookSecret?: string;
    public testMode?: boolean;

    init(privateKey: string, webhookSecret: string, testMode: boolean = false) {
        this.privateKey = privateKey;
        this.webhookSecret = webhookSecret;
        this.stripe = new Stripe(this.privateKey);
        this.testMode = testMode;
    }

    parseWebhook(body: any, sig: string) {
        if (!this.stripe) throw Error('Stripe not initialized');
        if (!this.webhookSecret) {
            console.error('Stripe not initialized')
            return;
        }
        return this.stripe.webhooks.constructEvent(body, sig, this.webhookSecret);
    }

    async cretePayment(price: string, success_url: string, pid: string, customer?: string) {
        if (!this.stripe) throw Error('Stripe not initialized');

        const checkout = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                { price, quantity: 1 }
            ],
            subscription_data: {
                metadata: { pid },
            },
            customer,
            success_url,
            mode: 'subscription'
        });

        return checkout;
    }

    async deleteSubscription(subscriptionId: string) {
        if (!this.stripe) throw Error('Stripe not initialized');
        const subscription = await this.stripe.subscriptions.cancel(subscriptionId);
        return subscription;
    }

    async getSubscription(subscriptionId: string) {
        if (!this.stripe) throw Error('Stripe not initialized');
        const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
        return subscription;
    }

    async getAllSubscriptions(customer_id: string) {
        if (!this.stripe) throw Error('Stripe not initialized');
        const subscriptions = await this.stripe.subscriptions.list({customer: customer_id});
        return subscriptions;
    }

    async getInvoices(customer_id: string) {
        const invoices = await this.stripe?.invoices.list({ customer: customer_id });
        return invoices;
    }


    async getCustomer(customer_id: string) {
        if (!this.stripe) throw Error('Stripe not initialized');
        const customer = await this.stripe.customers.retrieve(customer_id, { expand: [] })
        return customer;
    }

    async createCustomer(email: string) {
        if (!this.stripe) throw Error('Stripe not initialized');
        const customer = await this.stripe.customers.create({ email });
        return customer;
    }

    async deleteCustomer(customer_id: string) {
        if (!this.stripe) throw Error('Stripe not initialized');
        const { deleted } = await this.stripe.customers.del(customer_id);
        return deleted;
    }




    async createFreeSubscription(customer_id: string) {
        if (!this.stripe) throw Error('Stripe not initialized');

        const FREE_PLAN = getPlanFromTag('FREE');

        const subscription = await this.stripe.subscriptions.create({
            customer: customer_id,
            items: [
                { price: this.testMode ? FREE_PLAN.PRICE_TEST : FREE_PLAN.PRICE, quantity: 1 }
            ]
        });

        return subscription;

    }

}

const instance = new StripeService();
export default instance;
