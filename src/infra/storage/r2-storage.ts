import {
  Uploader,
  UploaderParams,
} from '@/domain/forum/application/storage/uploader';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { EnvService } from '../env/env.service';
import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client;

  constructor(private envSevice: EnvService) {
    const accountId = envSevice.get('CLOUDFLARE_ACCOUNT_ID');

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: envSevice.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: envSevice.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async upload({
    fileName,
    fileType,
    body,
  }: UploaderParams): Promise<{ url: string }> {
    const uploadId = randomUUID();
    const uniqueFileName = `${uploadId}-${fileName}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.envSevice.get('AWS_BUCKET_NAME'),
        Key: uniqueFileName,
        Body: body,
        ContentType: fileType,
      }),
    );

    return { url: uniqueFileName };
  }
}
