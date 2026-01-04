import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(userData: Partial<User>): Promise<User> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        const newUser = this.usersRepository.create({
            ...userData,
            password: hashedPassword,
        });
        return this.usersRepository.save(newUser);
    }

    async findByEmail(email: string): Promise<User | undefined> {
        return this.usersRepository.findOne({
            where: { email },
            select: ['id', 'name', 'email', 'password', 'role', 'isAdminUser', 'profilePicture']
        });
    }

    async findById(id: string): Promise<any> {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['orders']
        });
        if (!user) throw new NotFoundException('User not found');

        const totalOrders = user.orders.length;
        const totalSpent = user.orders.reduce((sum, order) => {
            // Only sum orders that are marked as 'Paid'
            if (order.status === 'Paid') {
                return sum + Number(order.totalAmount);
            }
            return sum;
        }, 0);

        return {
            ...user,
            totalOrders,
            totalSpent
        };
    }

    async update(id: string, updateData: Partial<User>): Promise<User> {
        const user = await this.findById(id);
        if (updateData.password) {
            const salt = await bcrypt.genSalt();
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }
        Object.assign(user, updateData);
        return this.usersRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find({
            order: { createdAt: 'DESC' }
        });
    }

    async changePassword(userId: string, oldPass: string, newPass: string): Promise<void> {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            select: ['id', 'password']
        });

        if (!user || !(await bcrypt.compare(oldPass, user.password))) {
            throw new NotFoundException('Current password is incorrect');
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPass, salt);
        await this.usersRepository.update(userId, { password: hashedPassword });
    }
}
