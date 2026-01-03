import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class CreatePaymentIntentDto {
    @ApiProperty({ example: 4999.98, description: 'Amount in USD' })
    @IsNumber()
    @IsPositive()
    amount: number;
}
