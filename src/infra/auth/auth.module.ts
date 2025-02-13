import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Env } from '@/infra/env';
import { JwtStrategy } from './jwt_strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory(config: ConfigService<Env, true>) {
        const privateKey = config.get('JTW_PRIVATE_KEY', { infer: true });
        const publicKey = config.get('JTW_PUBLIC_KEY', { infer: true });
        const expiresIn = config.get('EXPIRES_IN', { infer: true });

        return {
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
          signOptions: {
            algorithm: 'RS256',
            expiresIn,
          },
        };
      },
    }),
  ],
  providers: [JwtStrategy, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AuthModule {}
