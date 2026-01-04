import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true });

    // Enable CORS
    app.enableCors();

    // Serve Uploads as Static Files (Like a simple file server)
    // Access files at: http://localhost:5000/uploads/filename
    const { join } = require('path');
    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });

    // Global Validation Pipe
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    // Swagger Configuration
    const config = new DocumentBuilder()
        .setTitle('LuxeGems API')
        .setDescription('The LuxeGems E-Commerce API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.listen(5000);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
