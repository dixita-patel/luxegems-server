import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
    constructor(private ordersService: OrdersService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new order' })
    @ApiResponse({ status: 201, description: 'Order created successfully' })
    @ApiBody({ type: CreateOrderDto })
    create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.create(req.user, createOrderDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get user orders' })
    @ApiResponse({ status: 200, description: 'List of user orders' })
    findAll(@Request() req) {
        return this.ordersService.findAllByUser(req.user);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get order details' })
    @ApiResponse({ status: 200, description: 'Order details' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    findOne(@Param('id') id: string) {
        return this.ordersService.findOne(id);
    }
}
