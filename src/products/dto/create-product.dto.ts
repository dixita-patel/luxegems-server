import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsOptional, IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateProductDto {
    @ApiProperty({ example: 'Diamond Eternity Ring', description: 'Product name' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'Exquisite 18K white gold ring...', description: 'Product description' })
    @IsString()
    description: string;

    @ApiProperty({ example: 2499.99, description: 'Product price' })
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    price: number;

    @ApiProperty({ example: 'Rings', description: 'Product category' })
    @IsString()
    category: string;

    @ApiProperty({ type: 'string', format: 'binary', description: 'Product image file' })
    image: any;

    @ApiProperty({ example: true, required: false, description: 'Is product in stock?' })
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    inStock?: boolean;

    @ApiProperty({ example: false, required: false, description: 'Is product featured?' })
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    featured?: boolean;
}
