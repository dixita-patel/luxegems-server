import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
    private stripe: Stripe;

    constructor(private configService: ConfigService) {
        this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
            apiVersion: '2023-10-16',
        });
    }

    async createPaymentIntent(amount: number, currency: string = 'usd', metadata: any = {}) {
        return this.stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // convert to cents
            currency,
            metadata,
            automatic_payment_methods: {
                enabled: true,
            },
        });
    }

    constructEvent(payload: Buffer, signature: string) {
        const secret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
        return this.stripe.webhooks.constructEvent(payload, signature, secret);
    }
}
