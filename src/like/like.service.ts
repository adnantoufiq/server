// === FILE: server/src/like/like.service.ts ===
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from '../entities/like.entity';
import { Murmur } from '../entities/murmur.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,

    @InjectRepository(Murmur)
    private readonly murmurRepository: Repository<Murmur>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async likeMurmur(userId: number, murmurId: number): Promise<void> {
    const murmur = await this.murmurRepository.findOne({ where: { id: murmurId } });
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!murmur || !user) throw new NotFoundException('User or Murmur not found');

    const existing = await this.likeRepository.findOne({ where: { user: { id: userId }, murmur: { id: murmurId } } });
    if (existing) throw new ConflictException('Already liked');

    const like = this.likeRepository.create({ user, murmur });
    await this.likeRepository.save(like);
  }

  async unlikeMurmur(userId: number, murmurId: number): Promise<void> {
    const like = await this.likeRepository.findOne({
      where: {
        user: { id: userId },
        murmur: { id: murmurId },
      },
    });
    if (!like) throw new NotFoundException('Like not found');

    await this.likeRepository.remove(like);
  }
}