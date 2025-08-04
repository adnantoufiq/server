import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Follow } from './follow.entity';
import { Murmur } from './murmur.entity';
import { Like } from './like.entity';


@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'display_name', nullable: true, length: 100 })
  displayName?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl?: string;

  @Column({ name: 'followers_count', default: 0 })
  followersCount: number;

  @Column({ name: 'following_count', default: 0 })
  followingCount: number;

  @OneToMany(() => Murmur, (murmur) => murmur.user)
  murmurs: Murmur[];

  @OneToMany(() => Follow, (follow) => follow.follower)
   following: Follow[];

  @OneToMany(() => Follow, (follow) => follow.following)
  followers: Follow[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];
}