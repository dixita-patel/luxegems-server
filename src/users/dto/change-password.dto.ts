import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty({ example: 'oldPassword123', description: 'Current password' })
    @IsNotEmpty()
    @IsString()
    oldPassword: string;

    @ApiProperty({ example: 'newPassword123', description: 'New password' })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    newPassword: string;
}
