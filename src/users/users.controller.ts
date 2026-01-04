import { Controller, Get, Post, UseGuards, Request, Patch, Body, ForbiddenException, Param, HttpCode, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { MinioService } from '../minio/minio.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(
        private usersService: UsersService,
        private minioService: MinioService
    ) { }

    @Post('change-password')
    @HttpCode(200)
    @ApiOperation({ summary: 'Change current user password' })
    @ApiResponse({ status: 200, description: 'Password changed successfully' })
    @ApiResponse({ status: 404, description: 'Current password incorrect' })
    @ApiBody({ type: ChangePasswordDto })
    async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
        await this.usersService.changePassword(
            req.user.id,
            changePasswordDto.oldPassword,
            changePasswordDto.newPassword
        );
        return { message: 'Password updated successfully' };
    }

    @Get()
    @ApiOperation({ summary: 'Get all customers (Admin only)' })
    @ApiResponse({ status: 200, description: 'List of all users', type: [User] })
    @ApiResponse({ status: 403, description: 'Forbidden - Admins only' })
    async findAll(@Request() req) {
        if (!req.user.isAdminUser && req.user.role !== 'admin') {
            throw new ForbiddenException('Only admins can access the customer list');
        }
        return this.usersService.findAll();
    }

    @Get('profile')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'User profile data', type: User })
    async getProfile(@Request() req) {
        return this.usersService.findById(req.user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get user profile by ID (Admin only)' })
    @ApiResponse({ status: 200, description: 'User profile data', type: User })
    @ApiResponse({ status: 403, description: 'Forbidden - Admins only' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async findOne(@Param('id') id: string, @Request() req) {
        if (!req.user.isAdminUser && req.user.role !== 'admin') {
            throw new ForbiddenException('Only admins can view other user profiles');
        }
        return this.usersService.findById(id);
    }

    @Patch('profile')
    @UseInterceptors(FileInterceptor('profilePicture'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Update user profile' })
    @ApiResponse({ status: 200, description: 'Profile updated', type: User })
    async updateProfile(
        @Request() req,
        @Body() updateData: any,
        @UploadedFile() file: any
    ) {
        // Handle field mapping: "phone" -> "phoneNumber"
        if (updateData.phone && !updateData.phoneNumber) {
            updateData.phoneNumber = updateData.phone;
            delete updateData.phone;
        }

        if (file) {
            updateData.profilePicture = await this.minioService.uploadFile(file);
        }

        return this.usersService.update(req.user.id, updateData);
    }
}
