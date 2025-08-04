// === FILE: server/src/like/like.controller.ts ===
import { Controller, Post, Delete, Param, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { LikeService } from './like.service';
import { AuthGuard } from '../auth/auth.gurd';

@Controller('murmurs')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('/:id/like')
  @UseGuards(AuthGuard)
  async likeMurmur(@Param('id') murmurId: number, @Req() req): Promise<void> {
    if (!req.user?.id) throw new BadRequestException('User not authenticated');
    return this.likeService.likeMurmur(req.user.id, murmurId);
  }

  @Delete('/:id/unlike')
  @UseGuards(AuthGuard)
  async unlikeMurmur(@Param('id') murmurId: number, @Req() req): Promise<void> {
    if (!req.user?.id) throw new BadRequestException('User not authenticated');
    return this.likeService.unlikeMurmur(req.user.id, murmurId);
  }
}


