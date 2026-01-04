import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { User } from '../users/user.entity';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
        @Inject(forwardRef(() => PaymentService))
        private paymentService: PaymentService,
    ) { }

    async create(user: User, createOrderDto: any): Promise<{ order: Order, clientSecret: string }> {
        const orderData = {
            ...createOrderDto,
            user,
            status: 'Processing',
        };
        const order = this.ordersRepository.create(orderData);
        const savedOrder = (await this.ordersRepository.save(order)) as unknown as Order;

        // Generate Payment Intent
        const paymentIntent = await this.paymentService.createPaymentIntent(
            savedOrder.totalAmount,
            'usd',
            { orderId: savedOrder.id }
        );

        // Update order with payment ID
        savedOrder.stripePaymentId = paymentIntent.id;
        await this.ordersRepository.save(savedOrder);

        return {
            order: savedOrder,
            clientSecret: paymentIntent.client_secret,
        };
    }

    async findAllByUser(user: User): Promise<Order[]> {
        const where = (user.isAdminUser || user.role === 'admin') ? {} : { user: { id: user.id } };
        return this.ordersRepository.find({
            where,
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string): Promise<Order> {
        return this.ordersRepository.findOne({ where: { id }, relations: ['user'] });
    }

    async updateOrderStatus(id: string, status: string): Promise<void> {
        if (!id) return;
        await this.ordersRepository.update(id, { status });
    }

    async updateOrderPaymentId(id: string, paymentId: string): Promise<void> {
        if (!id) return;
        await this.ordersRepository.update(id, { stripePaymentId: paymentId });
    }
}
