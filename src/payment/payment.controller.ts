import { Controller, Post, Body, UseGuards, Headers, Req, BadRequestException, RawBodyRequest } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaymentService } from './payment.service';
import { OrdersService } from '../orders/orders.service';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
    constructor(
        private paymentService: PaymentService,
        private ordersService: OrdersService
    ) { }

    @Post('webhook')
    @ApiOperation({ summary: 'Stripe Webhook' })
    async handleWebhook(
        @Headers('stripe-signature') signature: string,
        @Req() req: RawBodyRequest<any>
    ) {
        if (!signature) {
            throw new BadRequestException('Missing stripe-signature header');
        }

        let event;
        try {
            event = this.paymentService.constructEvent(req.rawBody, signature);
        } catch (err) {
            console.error(`Webhook signature verification failed: ${err.message}`);
            throw new BadRequestException(`Webhook Error: ${err.message}`);
        }

        // Handle the event
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            const orderId = paymentIntent.metadata.orderId;

            if (orderId) {
                console.log(`Payment succeeded for order: ${orderId}`);
                await this.ordersService.updateOrderStatus(orderId, 'Paid');
            }
        } else if (event.type === 'payment_intent.payment_failed') {
            const paymentIntent = event.data.object;
            const orderId = paymentIntent.metadata.orderId;

            if (orderId) {
                console.log(`Payment failed for order: ${orderId}`);
                await this.ordersService.updateOrderStatus(orderId, 'Payment Failed');
            }
        }

        return { received: true };
    }
}
