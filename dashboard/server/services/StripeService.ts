import { getPlanFromId, getPlanFromTag } from '@data/PREMIUM';
import Stripe from 'stripe';

class StripeService {
    private stripe?: Stripe;
    private privateKey?: string;
    private webhookSecret?: string;
    public testMode?: boolean;
    private disabledMode: boolean = false;

    init(privateKey: string, webhookSecret: string, testMode: boolean = false) {
        this.privateKey = privateKey;
        this.webhookSecret = webhookSecret;
        this.stripe = new Stripe(this.privateKey);
        this.testMode = testMode;
    }

    disable() { this.disabledMode = true; }
    enable() { this.disabledMode = false; }
    isDisabled() { return this.disabledMode; }

    parseWebhook(body: any, sig: string) {
        if (this.disabledMode) return;
        if (!this.stripe) throw Error('Stripe not initialized');
        if (!this.webhookSecret) {
            console.error('Stripe not initialized')
            return;
        }
        return this.stripe.webhooks.constructEvent(body, sig, this.webhookSecret);
    }


    async createOnetimePayment(price: string, success_url: string, pid: string, customer?: string) {
        if (this.disabledMode) return;
        if (!this.stripe) throw Error('Stripe not initialized');

        const checkout = await this.stripe.checkout.sessions.create({
            allow_promotion_codes: true,
            payment_method_types: ['card'],
            invoice_creation: {
                enabled: true,
            },
            line_items: [
                { price, quantity: 1 }
            ],
            payment_intent_data: {
                metadata: {
                    pid, price
                }
            },
            customer,
            success_url,
            mode: 'payment'
        });

        return checkout;
    }

    async cretePayment(price: string, success_url: string, pid: string, customer?: string) {
        if (this.disabledMode) return;
        if (!this.stripe) throw Error('Stripe not initialized');

        const checkout = await this.stripe.checkout.sessions.create({
            allow_promotion_codes: true,
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

    async getPriceData(priceId: string) {
        if (this.disabledMode) return;
        if (!this.stripe) throw Error('Stripe not initialized');
        const priceData = await this.stripe.prices.retrieve(priceId);
        return priceData;
    }

    async deleteSubscription(subscriptionId: string) {
        if (this.disabledMode) return;
        if (!this.stripe) throw Error('Stripe not initialized');
        const subscription = await this.stripe.subscriptions.cancel(subscriptionId);
        return subscription;
    }

    async getSubscription(subscriptionId: string) {
        if (this.disabledMode) return;
        if (!this.stripe) throw Error('Stripe not initialized');
        const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
        return subscription;
    }

    async getAllSubscriptions(customer_id: string) {
        if (this.disabledMode) return;
        if (!this.stripe) throw Error('Stripe not initialized');
        const subscriptions = await this.stripe.subscriptions.list({ customer: customer_id });
        return subscriptions;
    }

    async getInvoices(customer_id: string) {
        if (this.disabledMode) return;
        if (!this.stripe) throw Error('Stripe not initialized');
        const invoices = await this.stripe?.invoices.list({ customer: customer_id });
        return invoices;
    }

    async getCustomer(customer_id: string) {
        if (this.disabledMode) return;
        if (!this.stripe) throw Error('Stripe not initialized');
        const customer = await this.stripe.customers.retrieve(customer_id, { expand: [] })
        return customer;
    }

    async createCustomer(email: string) {
        if (this.disabledMode) return;
        if (!this.stripe) throw Error('Stripe not initialized');
        const customer = await this.stripe.customers.create({ email });
        return customer;
    }

    async deleteCustomer(customer_id: string) {
        if (this.disabledMode) return;
        if (!this.stripe) throw Error('Stripe not initialized');
        const { deleted } = await this.stripe.customers.del(customer_id);
        return deleted;
    }

    async createOneTimeCoupon() {
        if (this.disabledMode) return;
        if (!this.stripe) throw Error('Stripe not initialized');
    }

    async createOneTimeSubscriptionDummy(customer_id: string, planId: number) {
        if (this.disabledMode) return;
        if (!this.stripe) throw Error('Stripe not initialized');

        const PLAN = getPlanFromId(planId);
        if (!PLAN) throw Error('Plan not found');

        const subscription = await this.stripe.subscriptions.create({
            customer: customer_id,
            items: [
                { price: this.testMode ? PLAN.PRICE_TEST : PLAN.PRICE, quantity: 1 }
            ],
        });

        return subscription;
    }

    async createFreeSubscription(customer_id: string) {
        if (this.disabledMode) return;
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
