
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.gurd';
import { Murmur } from '../entities/murmur.entity';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ===== Basic User Operations =====
  @Get('/api/getUsers')
  async getUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ): Promise<PaginatedResult<User>> {
    return this.userService.findAllPaginated(page, limit);
  }

  @Get('/api/getUser/:id')
  async getUser(@Param('id') id: number): Promise<User> {
    return this.userService.findById(id);
  }

  @Post('/api/postUser')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createUser(@Body() userData: CreateUserDto): Promise<User> {
    try {
      return await this.userService.create(userData);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put('/api/updateUser/:id')
  @UseGuards(AuthGuard)
  async updateUser(
    @Param('id') id: number,
    @Body() userData: UpdateUserDto,
    @Req() req
  ): Promise<User> {
    if (req.user.id !== id) {
      throw new BadRequestException('You can only update your own profile');
    }
    return this.userService.update(id, userData);
  }

  @Delete('/api/deleteUser/:id')
  @UseGuards(AuthGuard)
  async deleteUser(@Param('id') id: number, @Req() req): Promise<void> {
    if (req.user.id !== id) {
      throw new BadRequestException('You can only delete your own account');
    }
    return this.userService.delete(id);
  }

  // ===== Twitter-like Features =====
  @Get('/api/getUserMurmurs/:userId')
  async getUserMurmurs(
    @Param('userId') userId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ): Promise<PaginatedResult<Murmur>> {
    return this.userService.getUserMurmurs(userId, page, limit);
  }

  @Post('/api/followUser/:userId')
  @UseGuards(AuthGuard)
  async followUser(
    @Param('userId') userId: number,
    @Req() req
  ): Promise<void> {
    if (req.user.id === userId) {
      throw new BadRequestException('You cannot follow yourself');
    }
    return this.userService.followUser(req.user.id, userId);
  }

  @Delete('/api/unfollowUser/:userId')
  @UseGuards(AuthGuard)
  async unfollowUser(
    @Param('userId') userId: number,
    @Req() req
  ): Promise<void> {
    return this.userService.unfollowUser(req.user.id, userId);
  }

  @Get('/api/getFollowers/:userId')
  async getFollowers(
    @Param('userId') userId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ): Promise<PaginatedResult<User>> {
    return this.userService.getFollowers(userId, page, limit);
  }

  @Get('/api/getFollowing/:userId')
  async getFollowing(
    @Param('userId') userId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ): Promise<PaginatedResult<User>> {
    return this.userService.getFollowing(userId, page, limit);
  }

  // ===== Timeline =====
  @Get('/api/getTimeline')
 @UseGuards(AuthGuard)
async getTimeline(
  @Req() req,
  @Query('page') page = 1,
  @Query('limit') limit = 10
): Promise<PaginatedResult<Murmur>> {  // Changed to use PaginatedResult
  return this.userService.getTimeline(req.user.id, page, limit);
}

}