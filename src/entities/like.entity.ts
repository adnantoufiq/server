import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { User } from './user.entity';
import { Murmur } from './murmur.entity';

@Entity('likes')
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'userId' })  // Explicitly maps to your DB column
  userId: number;

  @ManyToOne(() => User, (user) => user.likes)
  @JoinColumn({ name: 'userId' })  // Links to the existing column
  user: User;

  @Column({ name: 'murmurId' })  // Explicitly maps to your DB column
  murmurId: number;

  @ManyToOne(() => Murmur, (murmur) => murmur.likes)
  @JoinColumn({ name: 'murmurId' })  // Links to the existing column
  murmur: Murmur;
}