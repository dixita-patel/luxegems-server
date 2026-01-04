import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && user.password && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = {
            email: user.email,
            sub: user.id,
            name: user.name,
            role: user.role,
            isAdminUser: user.isAdminUser,
            profilePicture: user.profilePicture
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isAdminUser: user.isAdminUser,
                profilePicture: user.profilePicture
            }
        };
    }

    async register(registerDto: any, profilePicturePath?: string) {
        const user = await this.usersService.create({
            ...registerDto,
            profilePicture: profilePicturePath
        });
        const { password, ...result } = user;
        return this.login(result);
    }
}
