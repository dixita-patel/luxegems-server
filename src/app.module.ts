import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { SeederModule } from './seeder/seeder.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DB_HOST', 'localhost'),
                port: configService.get<number>('DB_PORT', 5432),
                username: configService.get<string>('DB_USERNAME', 'postgres'),
                password: configService.get<string>('DB_PASSWORD', 'postgres'),
                database: configService.get<string>('DB_NAME', 'luxegems_db'),
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true, // Auto-create tables (dev only)
            }),
        }),
        AuthModule,
        UsersModule,
        ProductsModule,
        OrdersModule,
        PaymentModule,
        SeederModule,
        DashboardModule,
    ],
})
export class AppModule { }
