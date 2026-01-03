import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
    ) { }

    findAll(query: any): Promise<Product[]> {
        const where: any = {};
        if (query.category && query.category !== 'All') {
            where.category = query.category;
        }
        if (query.search) {
            where.name = Like(`%${query.search}%`);
        }
        if (query.featured) {
            where.featured = true;
        }
        return this.productsRepository.find({ where });
    }

    async findOne(id: string): Promise<Product> {
        const product = await this.productsRepository.findOne({ where: { id } });
        if (!product) throw new NotFoundException('Product not found');
        return product;
    }

    create(product: Partial<Product>): Promise<Product> {
        const newProduct = this.productsRepository.create(product);
        return this.productsRepository.save(newProduct);
    }
}
