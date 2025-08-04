// === FILE: server/src/like/like.module.ts ===
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from '../entities/like.entity';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { Murmur } from '../entities/murmur.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Like, Murmur, User])],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}