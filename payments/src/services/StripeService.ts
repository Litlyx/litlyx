
import Stripe from "stripe";
import { getPlanFromTag } from "../shared/data/PLANS";
import { PremiumModel } from "../shared/schema/PremiumSchema";

class StripeService {
    private stripe?: Stripe;
    private privateKey?: string;
    private webhookSecret?: string;
    public testMode?: boolean;

    init(privateKey: string, webhookSecret: string) {
        this.privateKey = privateKey;
        this.webhookSecret = webhookSecret;
        this.stripe = new Stripe(this.privateKey);
        this.testMode = this.privateKey.startsWith('sk_test');
    }

    parseWebhook(body: any, sig: string) {
        if (!this.stripe) throw Error('Stripe not initialized');
        if (!this.webhookSecret) {
            console.error('Stripe not initialized')
            return;
        }
        return this.stripe.webhooks.constructEvent(body, sig, this.webhookSecret);
    }


    async createOnetimePayment(price: string, success_url: string, pid: string, customer?: string) {
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

    async createPayment(price: string, success_url: string, user_id: string, customer: string) {
        if (!this.stripe) throw Error('Stripe not initialized');

        const checkout = await this.stripe.checkout.sessions.create({
            allow_promotion_codes: true,
            payment_method_types: ['card'],
            line_items: [
                { price, quantity: 1 }
            ],
            subscription_data: {
                metadata: { user_id },
            },
            customer,
            success_url,
            mode: 'subscription'
        });

        return checkout;
    }

    async getPriceData(priceId: string) {
        if (!this.stripe) throw Error('Stripe not initialized');
        const priceData = await this.stripe.prices.retrieve(priceId);
        return priceData;
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
        const subscriptions = await this.stripe.subscriptions.list({ customer: customer_id });
        return subscriptions;
    }

    async getInvoices(customer_id: string) {
        if (!this.stripe) throw Error('Stripe not initialized');
        const invoices = await this.stripe?.invoices.list({ customer: customer_id });
        return invoices;
    }

    async getCustomer(customer_id: string) {
        if (!this.stripe) throw Error('Stripe not initialized');
        const customer = await this.stripe.customers.retrieve(customer_id, { expand: [] })
        return customer;
    }

    async getCustomerPaymentMethods(customer_id: string) {
        if (!this.stripe) throw Error('Stripe not initialized');
        const paymentMethods = await this.stripe.customers.listPaymentMethods(customer_id);
        return paymentMethods;
    }

    async createCustomer(email: string) {
        if (!this.stripe) throw Error('Stripe not initialized');
        const customer = await this.stripe.customers.create({ email });
        return customer;
    }

    async setCustomerInfo(customer_id: string, address: { line1: string, line2: string, city: string, country: string, postal_code: string, state: string }) {
        if (!this.stripe) throw Error('Stripe not initialized');
        const customer = await this.stripe.customers.update(customer_id, {
            address: {
                line1: address.line1,
                line2: address.line2,
                city: address.city,
                country: address.country,
                postal_code: address.postal_code,
                state: address.state
            }
        })
        return customer.id;
    }

    async deleteCustomer(customer_id: string) {
        if (!this.stripe) throw Error('Stripe not initialized');
        const { deleted } = await this.stripe.customers.del(customer_id);
        return deleted;
    }

    async createSubscription(customer_id: string, planTag: string) {
        if (!this.stripe) throw Error('Stripe not initialized');

        const PLAN_DATA = getPlanFromTag(planTag as any);
        if (!PLAN_DATA) throw Error('Plan not found');

        const subscription = await this.stripe.subscriptions.create({
            customer: customer_id,
            items: [
                { price: this.testMode ? PLAN_DATA.PRICE_TEST : PLAN_DATA.PRICE, quantity: 1 }
            ],
        });

        return subscription;
    }

    async getPreviewUpgrade(customer_id: string, subscription_id: string, planTag: string) {
        if (!this.stripe) throw Error('Stripe not initialized');

        const PLAN_DATA = getPlanFromTag(planTag as any);
        if (!PLAN_DATA) throw Error('Plan not found');

        const premiumData = await PremiumModel.findOne({ customer_id });
        if (!premiumData) throw Error('Plan not found');

        const currentSubscription = await this.stripe.subscriptions.retrieve(premiumData?.subscription_id)
        if (!premiumData) throw Error('Subscription not found');

        const preview = await this.stripe.invoices.createPreview({
            customer: customer_id,
            subscription: subscription_id,
            subscription_details: {
                items: [
                    { id: currentSubscription.items.data[0].id, price: this.testMode ? PLAN_DATA.PRICE_TEST : PLAN_DATA.PRICE, quantity: 1 }
                ],
                proration_date: Math.floor(Date.now() / 1000),
                proration_behavior: 'always_invoice'
            }
        });

        return preview;
    }

    async createInvoice(customer_id: string) {
        if (!this.stripe) throw Error('Stripe not initialized');

        const premiumData = await PremiumModel.findOne({ customer_id });
        if (!premiumData) throw Error('Plan not found');

        const currentSubscription = await this.stripe.subscriptions.retrieve(premiumData?.subscription_id)
        if (!premiumData) throw Error('Subscription not found');

        const invoice = await this.stripe.invoices.create({
            customer: customer_id,
            subscription: currentSubscription.id,
        });

        if (!invoice || !invoice.id) throw Error('Cannot create invoice');

        const finalized = this.stripe.invoices.finalizeInvoice(invoice.id);

        return finalized;
    }

    async updateSubscriptionWithPrice(customer_id: string, subscription_id: string, plan_tag: string) {

        if (!this.stripe) throw Error('Stripe not initialized');

        const PLAN_DATA = getPlanFromTag(plan_tag as any);
        if (!PLAN_DATA) throw Error('Plan not found');

        const premiumData = await PremiumModel.findOne({ customer_id });
        if (!premiumData) throw Error('Plan not found');

        const currentSubscription = await this.stripe.subscriptions.retrieve(premiumData?.subscription_id)
        if (!premiumData) throw Error('Subscription not found');

        this.stripe.subscriptions.update(subscription_id, {
            items: [
                { id: currentSubscription.items.data[0].id, price: this.testMode ? PLAN_DATA.PRICE_TEST : PLAN_DATA.PRICE, quantity: 1 }
            ],
            proration_date: Math.floor(Date.now() / 1000),
            proration_behavior: 'always_invoice'
        })

    }

    async cancelPlan(customer_id: string) {
        if (!this.stripe) throw Error('Stripe not initialized');
        const paymentMethods = await this.stripe.customers.listPaymentMethods(customer_id);
        for (const paymentMethod of paymentMethods.data) {
            await this.stripe.paymentMethods.detach(paymentMethod.id);
        }
        return { ok: true, count: paymentMethods.data.length }
    }

}

const instance = new StripeService();
export default instance;
