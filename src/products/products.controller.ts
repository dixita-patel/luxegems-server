import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) { }

    @Get()
    @ApiOperation({ summary: 'Get all products with filters' })
    @ApiQuery({ name: 'category', required: false, example: 'Rings' })
    @ApiQuery({ name: 'search', required: false, example: 'Diamond' })
    @ApiQuery({ name: 'featured', required: false, type: Boolean })
    @ApiResponse({ status: 200, description: 'List of products' })
    findAll(@Query() query: any) {
        return this.productsService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get product by ID' })
    @ApiResponse({ status: 200, description: 'Product details' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    // Admin only in real app, keeping simple for now
    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Create new product' })
    @ApiResponse({ status: 201, description: 'Product created successfully' })
    @ApiBody({ type: CreateProductDto })
    create(@Body() productData: CreateProductDto) {
        return this.productsService.create(productData);
    }
}
