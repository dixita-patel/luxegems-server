import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { User } from '../users/user.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
    ) { }

    async create(user: User, createOrderDto: any): Promise<Order> {
        const orderData = {
            ...createOrderDto,
            user,
            status: 'Processing',
        };
        const order = this.ordersRepository.create(orderData);
        return (await this.ordersRepository.save(order)) as unknown as Order;
    }

    async findAllByUser(user: User): Promise<Order[]> {
        return this.ordersRepository.find({
            where: { user: { id: user.id } },
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string): Promise<Order> {
        return this.ordersRepository.findOne({ where: { id }, relations: ['user'] });
    }
}
