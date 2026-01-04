import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'user@example.com', description: 'User email' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123', description: 'User password' })
    @IsNotEmpty()
    password: string;
}

export class RegisterDto {
    @ApiProperty({ example: 'John Doe', description: 'Full name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'user@example.com', description: 'User email' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123', description: 'User password (min 6 chars)' })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ type: 'string', format: 'binary', required: false, description: 'Profile Picture' })
    profilePicture?: any;
}

export class AuthResponseDto {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT Access Token' })
    access_token: string;

    @ApiProperty({
        example: {
            id: 'uuid-1234',
            name: 'John Doe',
            email: 'user@example.com',
            role: 'user',
            isAdminUser: false,
            profilePicture: 'uploads/file.jpg'
        }
    })
    user: any;
}
