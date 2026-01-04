import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.entity';

@Entity('orders')
export class Order {
    @ApiProperty({ example: 'uuid-1234' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.orders)
    user: User;

    @ApiProperty({
        example: [{ id: 'prod-1', quantity: 2, price: 100 }]
    })
    @Column('jsonb')
    items: any[];

    @ApiProperty({ example: 200.00 })
    @Column('decimal', { precision: 10, scale: 2 })
    totalAmount: number;

    @ApiProperty({ example: 'Pending' })
    @Column({ default: 'Pending' })
    status: string;

    @ApiProperty({
        example: { street: '123 Main St', city: 'NY', zip: '10001' }
    })
    @Column('jsonb', { nullable: true })
    shippingAddress: any;

    @ApiProperty({ example: 'cs_test_123' })
    @Column({ nullable: true })
    stripePaymentId: string;

    @ApiProperty()
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty()
    @UpdateDateColumn()
    updatedAt: Date;
}
