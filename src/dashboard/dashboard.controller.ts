import { Controller, Get, UseGuards, ForbiddenException, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
    constructor(private dashboardService: DashboardService) { }

    private checkAdmin(req) {
        if (!req.user.isAdminUser && req.user.role !== 'admin') {
            throw new ForbiddenException('Only admins can access the dashboard data');
        }
    }

    @Get('stats')
    @ApiOperation({ summary: 'Get dashboard overview statistics' })
    @ApiResponse({
        status: 200,
        description: 'Revenue, Orders, and Customer stats',
        content: {
            'application/json': {
                example: {
                    totalRevenue: { value: 124592, change: '+12.5%' },
                    totalOrders: { value: 1245, change: '+8.2%' },
                    totalCustomers: { value: 324, change: '+2.4%' },
                    activeAlerts: { value: 12, change: '-4.1%' }
                }
            }
        }
    })
    async getStats(@Request() req) {
        this.checkAdmin(req);
        return this.dashboardService.getStats();
    }

    @Get('activity')
    @ApiOperation({ summary: 'Get recent activity feed' })
    @ApiResponse({
        status: 200,
        description: 'Recent orders and user registrations',
        content: {
            'application/json': {
                example: [
                    {
                        type: 'order',
                        title: 'New order #ORD-7281',
                        subtitle: 'John Doe placed an order',
                        time: '2024-05-01T10:00:00Z'
                    },
                    {
                        type: 'user',
                        title: "User 'Jane Smith' registered",
                        subtitle: 'jane@example.com',
                        time: '2024-05-01T09:45:00Z'
                    }
                ]
            }
        }
    })
    async getActivity(@Request() req) {
        this.checkAdmin(req);
        return this.dashboardService.getRecentActivity();
    }

    @Get('analytics')
    @ApiOperation({ summary: 'Get sales analytics chart data' })
    @ApiResponse({
        status: 200,
        description: 'Monthly revenue data for charts',
        content: {
            'application/json': {
                example: [
                    { name: 'Jan', revenue: 45000 },
                    { name: 'Feb', revenue: 52000 },
                    { name: 'Mar', revenue: 48000 }
                ]
            }
        }
    })
    async getAnalytics(@Request() req) {
        this.checkAdmin(req);
        return this.dashboardService.getSalesAnalytics();
    }
}
