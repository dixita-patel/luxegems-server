import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from '../orders/order.entity';

@Entity('users')
export class User {
    @ApiProperty({ example: 'uuid-1234' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 'John Doe' })
    @Column()
    name: string;

    @ApiProperty({ example: 'user@example.com' })
    @Column({ unique: true })
    email: string;

    @ApiProperty({ example: '+1 (555) 000-0000' })
    @Column({ nullable: true })
    phoneNumber: string;

    @Column({ select: false })
    password?: string; // Hashed password

    @ApiProperty({ example: 'http://localhost:9000/assets/avatar.jpg' })
    @Column({ nullable: true })
    profilePicture: string;

    @ApiProperty({ example: 'user' })
    @Column({ default: 'user' })
    role: string; // 'user' | 'admin'

    @ApiProperty({ example: false })
    @Column({ default: false })
    isAdminUser: boolean;

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];

    @ApiProperty()
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty()
    @UpdateDateColumn()
    updatedAt: Date;

    @ApiProperty({ example: 5 })
    totalOrders?: number;

    @ApiProperty({ example: 1250.50 })
    totalSpent?: number;
}
