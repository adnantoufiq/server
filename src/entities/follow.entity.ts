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
    default: () => 'CURRENT_TIMESTAMP',
    precision: 0, // Remove fractional seconds
  })
  createdAt: Date;

  // Optional: Add updatedAt if you need to track when relationships change
  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    precision: 0,
    nullable: true,
  })
  updatedAt?: Date;
}