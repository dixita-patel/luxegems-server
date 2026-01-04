import { Controller, Get, Post, Body, Param, Query, UseGuards, UseInterceptors, UploadedFile, NotFoundException, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { MinioService } from '../minio/minio.service';
import { Product } from './product.entity';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(
        private productsService: ProductsService,
        private minioService: MinioService
    ) { }

    @Get()
    @ApiOperation({ summary: 'Get all products with filters' })
    @ApiQuery({ name: 'category', required: false, example: 'Rings' })
    @ApiQuery({ name: 'search', required: false, example: 'Diamond' })
    @ApiQuery({ name: 'featured', required: false, type: Boolean })
    @ApiResponse({ status: 200, description: 'List of products', type: [Product] })
    findAll(@Query() query: any) {
        return this.productsService.findAll(query);
    }

    @Get('featured')
    @ApiOperation({ summary: 'Get featured products' })
    @ApiResponse({ status: 200, description: 'List of featured products', type: [Product] })
    findFeatured() {
        return this.productsService.findAll({ featured: true });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get product by ID' })
    @ApiResponse({ status: 200, description: 'Product details', type: Product })
    @ApiResponse({ status: 404, description: 'Product not found' })
    findOne(@Param('id') id: string) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            throw new NotFoundException('Invalid product ID format');
        }
        return this.productsService.findOne(id);
    }

    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Create new product' })
    @ApiResponse({ status: 201, description: 'Product created successfully', type: Product })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image'))
    @ApiBody({ type: CreateProductDto })
    async create(@Body() productData: CreateProductDto, @UploadedFile() file: any) {
        if (file) {
            productData.image = await this.minioService.uploadFile(file);
        }

        return this.productsService.create(productData);
    }

    @Patch(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update product details' })
    @ApiResponse({ status: 200, description: 'Product updated successfully', type: Product })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image'))
    @ApiBody({ type: UpdateProductDto })
    async update(
        @Param('id') id: string,
        @Body() updateData: UpdateProductDto,
        @UploadedFile() file: any
    ) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            throw new NotFoundException('Invalid product ID format');
        }

        if (file) {
            updateData.image = await this.minioService.uploadFile(file);
        }

        return this.productsService.update(id, updateData);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Delete product' })
    @ApiResponse({ status: 200, description: 'Product deleted successfully' })
    async remove(@Param('id') id: string) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            throw new NotFoundException('Invalid product ID format');
        }
        await this.productsService.remove(id);
        return { message: 'Product deleted successfully' };
    }
}
