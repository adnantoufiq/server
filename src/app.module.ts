import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Murmur } from './entities/murmur.entity';
import { Like } from './entities/like.entity';
import { Follow } from './entities/follow.entity';
import { DefaultNamingStrategy } from 'typeorm';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Database configuration
    TypeOrmModule.forRootAsync({
      
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', 'localhost'), // Fallback value
        port: config.get<number>('DB_PORT', 3306),
        username: config.get<string>('DB_USERNAME', 'docker'),
        password: config.get<string>('DB_PASSWORD', 'docker'),
        database: config.get<string>('DB_NAME', 'test'),
        entities: [User, Murmur, Like, Follow], // All entities
        synchronize: config.get<string>('NODE_ENV') !== 'production', // Auto-sync in dev
        retryAttempts: 5,
        retryDelay: 3000,
        logging: config.get<string>('NODE_ENV') === 'development',
        namingStrategy: new DefaultNamingStrategy(), // Keeps original field names
      }),
      inject: [ConfigService],
    }),
    
    // Register repositories
    TypeOrmModule.forFeature([User, Murmur, Like, Follow]),
  ],
})
export class AppModule {}