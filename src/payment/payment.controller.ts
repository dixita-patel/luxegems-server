import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaymentService } from './payment.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';

@ApiTags('Payment')
@ApiBearerAuth()
@Controller('payment')
@UseGuards(JwtAuthGuard)
export class PaymentController {
    constructor(private paymentService: PaymentService) { }

    @Post('create-intent')
    @ApiOperation({ summary: 'Create Stripe Payment Intent' })
    @ApiResponse({ status: 201, description: 'Payment Intent created', schema: { example: { clientSecret: 'pi_...' } } })
    @ApiBody({ type: CreatePaymentIntentDto })
    async createPaymentIntent(@Body() body: CreatePaymentIntentDto) {
        const paymentIntent = await this.paymentService.createPaymentIntent(body.amount);
        return { clientSecret: paymentIntent.client_secret };
    }
}
