// === FILE: server/src/app.module.ts ===
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefaultNamingStrategy } from 'typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module'; // ✅ Add this

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get('DB_USERNAME', 'docker'),
        password: config.get('DB_PASSWORD', 'docker'),
        database: config.get('DB_NAME', 'test'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: config.get('NODE_ENV') !== 'production',
        retryAttempts: 5,
        retryDelay: 3000,
        logging: config.get('NODE_ENV') === 'development',
        namingStrategy: new DefaultNamingStrategy(),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule, // ✅ Required to resolve AuthGuard with JwtService
  ],
})
export class AppModule {}
