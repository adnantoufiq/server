import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../entities/user.entity';
import { Murmur } from '../entities/murmur.entity';
import { Follow } from '../entities/follow.entity';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { Like } from 'src/entities/like.entity';

@Injectable()
export class UserService {
    constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    
    @InjectRepository(Murmur)
    private murmurRepository: Repository<Murmur>,
    
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,

    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}
  // ===== Basic User Operations =====
  async findAllPaginated(
    page = 1,
    limit = 10,
  ): Promise<PaginatedResult<User>> {
    const [users, count] = await this.userRepository.findAndCount({
      relations: ['followers', 'following', 'murmurs', 'likes'],
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data: users, count };
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['followers', 'following', 'murmurs', 'likes'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(data: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create({
        ...data,
        passwordHash: await bcrypt.hash(data.password, 10),
      });

      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Username or email already exists');
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    try {
      await this.userRepository.update(id, data);
      return await this.findById(id);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const result = await this.userRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  // ===== Twitter-like Features =====
  async getUserMurmurs(
    userId: number,
    page = 1,
    limit = 10,
  ): Promise<PaginatedResult<Murmur>> {
    const [murmurs, count] = await this.murmurRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ['user', 'likes'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data: murmurs, count };
  }

 async followUser(followerId: number, followingId: number): Promise<void> {
    if (followerId === followingId) {
        throw new BadRequestException('You cannot follow yourself');
    }

    const existingFollow = await this.followRepository.findOne({
        where: {
            follower: { id: followerId },
            following: { id: followingId } // Changed from followee to following
        },
    });

    if (existingFollow) {
        throw new BadRequestException('You are already following this user');
    }

    try {
        await this.followRepository.save({
            follower: { id: followerId },
            following: { id: followingId } // Changed from followee to following
        });

        // Update counts (unchanged)
        await this.userRepository.increment({ id: followerId }, 'followingCount', 1);
        await this.userRepository.increment({ id: followingId }, 'followersCount', 1);
    } catch (error) {
        throw new InternalServerErrorException('Failed to follow user');
    }
}

async unfollowUser(followerId: number, followingId: number): Promise<void> {
    try {
        const result = await this.followRepository.delete({
            follower: { id: followerId },
            following: { id: followingId } // Changed from followee to following
        });

        if (result.affected === 0) {
            throw new BadRequestException('You are not following this user');
        }

        // Update counts (unchanged)
        await this.userRepository.decrement({ id: followerId }, 'followingCount', 1);
        await this.userRepository.decrement({ id: followingId }, 'followersCount', 1);
    } catch (error) {
        throw new InternalServerErrorException('Failed to unfollow user');
    }
}

// getFollowers remains unchanged as it uses followee which matches your entity's join
async getFollowers(
    userId: number,
    page = 1,
    limit = 10,
): Promise<PaginatedResult<User>> {
    const [follows, count] = await this.followRepository.findAndCount({
        where: { following: { id: userId } }, // Changed from followee to following
        relations: ['follower'],
        skip: (page - 1) * limit,
        take: limit,
    });

    const followers = follows.map((follow) => follow.follower);
    return { data: followers, count };
}

// getFollowing remains unchanged as it uses follower which matches your entity
async getFollowing(
    userId: number,
    page = 1,
    limit = 10,
): Promise<PaginatedResult<User>> {
    const [follows, count] = await this.followRepository.findAndCount({
        where: { follower: { id: userId } },
        relations: ['following'], // Changed from followee to following
        skip: (page - 1) * limit,
        take: limit,
    });

    const following = follows.map((follow) => follow.following); // Changed from followee to following
    return { data: following, count };
}

// Timeline method needs following instead of followee
async getTimeline(
    userId: number,
    page = 1,
    limit = 10,
): Promise<PaginatedResult<Murmur>> {
    const following = await this.followRepository.find({
        where: { follower: { id: userId } },
        relations: ['following'], // Changed from followee to following
    });

    const followingIds = following.map((follow) => follow.following.id); // Changed from followee to following
    followingIds.push(userId);

    const [murmurs, count] = await this.murmurRepository.findAndCount({
        where: { user: { id: In(followingIds) } },
        relations: ['user', 'likes'],
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
    });

    return { data: murmurs, count };
}
}