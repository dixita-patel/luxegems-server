import { Controller, Request, Post, UseGuards, Body, BadRequestException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { MinioService } from '../minio/minio.service';
import { LoginDto, RegisterDto, AuthResponseDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private minioService: MinioService
    ) { }

    @Post('login')
    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({ status: 200, description: 'Login successful', type: AuthResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBody({ type: LoginDto })
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new BadRequestException('Invalid credentials');
        }
        return this.authService.login(user);
    }

    @Post('register')
    @ApiOperation({ summary: 'Register new user' })
    @ApiResponse({ status: 201, description: 'User successfully registered', type: AuthResponseDto })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('profilePicture'))
    @ApiBody({ type: RegisterDto })
    async register(@Body() registerDto: RegisterDto, @UploadedFile() file?: any) {
        let profilePictureUrl: string | undefined;
        if (file) {
            profilePictureUrl = await this.minioService.uploadFile(file);
        }
        return this.authService.register(registerDto, profilePictureUrl);
    }
}
