import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Order } from '../orders/order.entity';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Order, User, Product])],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule { }
