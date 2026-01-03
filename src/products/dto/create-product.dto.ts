import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateProductDto {
    @ApiProperty({ example: 'Diamond Eternity Ring', description: 'Product name' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'Exquisite 18K white gold ring...', description: 'Product description' })
    @IsString()
    description: string;

    @ApiProperty({ example: 2499.99, description: 'Product price' })
    @IsNumber()
    price: number;

    @ApiProperty({ example: 'Rings', description: 'Product category' })
    @IsString()
    category: string;

    @ApiProperty({ example: 'https://example.com/image.jpg', description: 'Product image URL' })
    @IsString()
    image: string;

    @ApiProperty({ example: true, required: false, description: 'Is product in stock?' })
    @IsBoolean()
    @IsOptional()
    inStock?: boolean;

    @ApiProperty({ example: false, required: false, description: 'Is product featured?' })
    @IsBoolean()
    @IsOptional()
    featured?: boolean;
}
