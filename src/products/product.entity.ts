import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('products')
export class Product {
    @ApiProperty({ example: 'uuid-1234' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 'Diamond Eternity Ring' })
    @Column()
    name: string;

    @ApiProperty({ example: 'A beautiful diamond ring.' })
    @Column('text')
    description: string;

    @ApiProperty({ example: 2499.99 })
    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @ApiProperty({ example: 'Rings' })
    @Column()
    category: string;

    @ApiProperty({ example: 'http://localhost:9000/assets/ring.jpg' })
    @Column()
    image: string;

    @ApiProperty({ example: true })
    @Column({ default: true })
    inStock: boolean;

    @ApiProperty({ example: false })
    @Column({ default: false })
    featured: boolean;

    @ApiProperty({ example: 0 })
    @Column({ type: 'int', default: 0 })
    discount: number;

    @ApiProperty()
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty()
    @UpdateDateColumn()
    updatedAt: Date;
}
