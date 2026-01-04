import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Order } from '../orders/order.entity';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
    ) { }

    async getStats() {
        const totalOrders = await this.ordersRepository.count();
        const totalCustomers = await this.usersRepository.count({ where: { isAdminUser: false } });
        const totalProducts = await this.productsRepository.count();

        const orders = await this.ordersRepository.find({ where: { status: 'Paid' } });
        const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);

        // Simplistic percentage calculation (comparing to total)
        // In a real app, you'd compare this month vs last month
        return {
            totalRevenue: {
                value: totalRevenue,
                change: '+12.5%',
            },
            totalOrders: {
                value: totalOrders,
                change: '+8.2%',
            },
            totalCustomers: {
                value: totalCustomers,
                change: '+2.4%',
            },
            activeAlerts: {
                value: await this.productsRepository.count({ where: { inStock: false } }),
                change: '-4.1%',
            },
        };
    }

    async getRecentActivity() {
        const recentOrders = await this.ordersRepository.find({
            relations: ['user'],
            order: { createdAt: 'DESC' },
            take: 5,
        });

        const recentUsers = await this.usersRepository.find({
            order: { createdAt: 'DESC' },
            take: 5,
        });

        const activities = [
            ...recentOrders.map((o) => ({
                type: 'order',
                title: `New order #${o.id.substring(0, 8)}`,
                subtitle: `${o.user?.name || 'Guest'} placed an order`,
                time: o.createdAt,
            })),
            ...recentUsers.map((u) => ({
                type: 'user',
                title: `User '${u.name}' registered`,
                subtitle: u.email,
                time: u.createdAt,
            })),
        ];

        return activities.sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 8);
    }

    async getSalesAnalytics() {
        // Get last 6 months of data
        const analytics = [];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthLabel = months[d.getMonth()];

            const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
            const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);

            const orders = await this.ordersRepository.find({
                where: {
                    status: 'Paid',
                    createdAt: Between(startOfMonth, endOfMonth),
                },
            });

            const monthlyRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
            analytics.push({ name: monthLabel, revenue: monthlyRevenue });
        }

        return analytics;
    }
}
