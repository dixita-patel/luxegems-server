import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.entity';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
    constructor(private ordersService: OrdersService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new order and generate payment intent' })
    @ApiResponse({
        status: 201,
        description: 'Order created successfully. Returns the order object and Stripe clientSecret.',
        schema: {
            example: {
                order: { id: 'uuid-123', totalAmount: 2500, status: 'Processing' },
                clientSecret: 'pi_3P6..._secret_...'
            }
        }
    })
    @ApiBody({ type: CreateOrderDto })
    async create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.create(req.user, createOrderDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all orders (Admin) or user orders (Customer)' })
    @ApiResponse({ status: 200, description: 'List of orders', type: [Order] })
    findAll(@Request() req) {
        return this.ordersService.findAllByUser(req.user);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get order details' })
    @ApiResponse({ status: 200, description: 'Order details', type: Order })
    @ApiResponse({ status: 404, description: 'Order not found' })
    findOne(@Param('id') id: string) {
        return this.ordersService.findOne(id);
    }
}
