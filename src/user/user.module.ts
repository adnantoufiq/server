import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../entities/user.entity';
import { Murmur } from '../entities/murmur.entity';
import { Follow } from '../entities/follow.entity';
import { Like } from '../entities/like.entity';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';  // Import AuthModule to resolve circular dependency

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Murmur, Follow, Like]), // Add all entities here
    forwardRef(() => AuthModule), // Fix circular dependency (AuthGuard uses UserService, UserService uses AuthGuard maybe)
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService], // Export for use in AuthModule/AuthGuard
})
export class UserModule {}
