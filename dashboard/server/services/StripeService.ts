import Stripe from 'stripe';

class StripeService {
    private stripe?: Stripe;
    private privateKey?: string;
    private webhookSecret?: string;

    init(privateKey: string, webhookSecret: string) {
        this.privateKey = privateKey;
        this.webhookSecret = webhookSecret;
        this.stripe = new Stripe(this.privateKey);
    }
    parseWebhook(body: any, sig: string) {
        if (!this.stripe) {
            console.error('Stripe not initialized')
            return;
        }
        if (!this.webhookSecret) {
            console.error('Stripe not initialized')
            return;
        }
        return this.stripe.webhooks.constructEvent(body, sig, this.webhookSecret);
    }

    async cretePayment(price: string, success_url: string, customer?: string) {
        if (!this.stripe) {
            console.error('Stripe not initialized')
            return;
        }
        const checkout = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                { price, quantity: 1 }
            ],
            customer,
            success_url,
            mode: 'subscription'
        });

        return checkout;
    }

    async getSubscription(subscriptionId: string) {
        if (!this.stripe) {
            console.error('Stripe not initialized')
            return;
        }
        const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
        return subscription;
    }
}

const instance = new StripeService();
export default instance;
