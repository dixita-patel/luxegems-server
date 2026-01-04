import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async onApplicationBootstrap() {
        await this.seedUsers();
    }

    public async seedUsers() {
        const adminEmail = 'admin@luxegems.com';
        const userEmail = 'user@luxegems.com';

        // Check if Admin exists
        const adminExists = await this.userRepository.findOne({ where: { email: adminEmail } });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const admin = this.userRepository.create({
                name: 'Admin User',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                isAdminUser: true,
            });
            await this.userRepository.save(admin);
            console.log('✅ Admin user seeded');
        }

        // Check if Standard User exists
        const userExists = await this.userRepository.findOne({ where: { email: userEmail } });
        if (!userExists) {
            const hashedPassword = await bcrypt.hash('user123', 10);
            const user = this.userRepository.create({
                name: 'Standard User',
                email: userEmail,
                password: hashedPassword,
                role: 'user',
                isAdminUser: false,
            });
            await this.userRepository.save(user);
            console.log('✅ Standard user seeded');
        }
    }
}
