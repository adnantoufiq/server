import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { User } from './user.entity';

@Entity('follows')
export class Follow {
  @PrimaryColumn({ name: 'followerId' })
  followerId: number;

  @PrimaryColumn({ name: 'followingId' })
  followingId: number;

  @ManyToOne(() => User, (user) => user.following)
  @JoinColumn({ name: 'followerId' })
  follower: User;

  @ManyToOne(() => User, (user) => user.followers)
  @JoinColumn({ name: 'followingId' })
  following: User;

  @Column({ 
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdAt: Date;
}