import { Injectable, OnModuleInit, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
    private minioClient: Minio.Client;
    private bucketName: string;

    constructor(private configService: ConfigService) {
        this.bucketName = this.configService.get<string>('MINIO_BUCKET', 'luxegems-assets');
        this.minioClient = new Minio.Client({
            endPoint: this.configService.get<string>('MINIO_ENDPOINT', 'localhost'),
            port: parseInt(this.configService.get<string>('MINIO_PORT', '9000'), 10),
            useSSL: this.configService.get<string>('MINIO_USE_SSL') === 'true',
            accessKey: this.configService.get<string>('MINIO_ACCESS_KEY', 'minioadmin'),
            secretKey: this.configService.get<string>('MINIO_SECRET_KEY', 'minioadmin'),
        });
    }

    async onModuleInit() {
        try {
            const bucketExists = await this.minioClient.bucketExists(this.bucketName);
            if (!bucketExists) {
                await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
                console.log(`Bucket ${this.bucketName} created successfully`);
            }

            // Apply Public Read Policy
            const policy = {
                Version: '2012-10-17',
                Statement: [
                    {
                        Effect: 'Allow',
                        Principal: { AWS: ['*'] },
                        Action: ['s3:GetObject'],
                        Resource: [`arn:aws:s3:::${this.bucketName}/*`],
                    },
                ],
            };
            await this.minioClient.setBucketPolicy(this.bucketName, JSON.stringify(policy));
            console.log(`Bucket ${this.bucketName} is now public`);
        } catch (error) {
            console.warn(`WARNING: Could not connect to MinIO at ${this.configService.get('MINIO_ENDPOINT')}:${this.configService.get('MINIO_PORT')}`);
            console.warn('File uploads will fail until MinIO is running.');
        }
    }

    async uploadFile(file: any): Promise<string> {
        const timestamp = Date.now();
        const fileName = `${timestamp}-${file.originalname.replace(/\s+/g, '-')}`;

        try {
            await this.minioClient.putObject(
                this.bucketName,
                fileName,
                file.buffer,
                file.size,
                { 'Content-Type': file.mimetype }
            );

            // Construct public URL
            const useSSL = this.configService.get<string>('MINIO_USE_SSL') === 'true';
            const protocol = useSSL ? 'https' : 'http';
            const endpoint = this.configService.get<string>('MINIO_ENDPOINT', 'localhost');
            const port = this.configService.get<string>('MINIO_PORT', '9000');

            return `${protocol}://${endpoint}:${port}/${this.bucketName}/${fileName}`;
        } catch (error) {
            console.error('MinIO upload error:', error);
            throw new InternalServerErrorException('Failed to upload file');
        }
    }
}
