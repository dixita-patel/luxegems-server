import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeederService } from './seeder/seeder.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const seeder = app.get(SeederService);

    try {
        console.log('🌱 Starting database seeding...');
        await seeder.seedUsers();
        console.log('✅ Seeding completed successfully.');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
    } finally {
        await app.close();
    }
}

bootstrap();
