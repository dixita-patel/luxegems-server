import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
    @ApiProperty({ example: 'prod-uuid-1', description: 'Product ID' })
    @IsString()
    id: string;

    @ApiProperty({ example: 2, description: 'Quantity' })
    @IsNumber()
    quantity: number;
}

class ShippingAddressDto {
    @ApiProperty({ example: '123 Main St', description: 'Street Address' })
    @IsString()
    street: string;

    @ApiProperty({ example: 'New York', description: 'City' })
    @IsString()
    city: string;

    @ApiProperty({ example: '10001', description: 'Zip Code' })
    @IsString()
    zip: string;
}

export class CreateOrderDto {
    @ApiProperty({ type: [OrderItemDto], description: 'List of items in the order' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @ApiProperty({ example: 4999.98, description: 'Total amount of the order' })
    @IsNumber()
    totalAmount: number;

    @ApiProperty({ type: ShippingAddressDto, description: 'Shipping address' })
    @ValidateNested()
    @Type(() => ShippingAddressDto)
    shippingAddress: ShippingAddressDto;

    @ApiProperty({ example: 'pi_123456789', required: false, description: 'Stripe Payment/Intent ID' })
    @IsString()
    @IsOptional()
    stripePaymentId?: string;
}
