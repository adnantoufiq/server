import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Like } from './like.entity';

// Rest of your code...


@Entity('murmurs')
export class Murmur {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.murmurs)
  user: User;

  @Column({ length: 280 })
  content: string;

  @OneToMany(() => Like, (like) => like.murmur)
  likes: Like[];
}