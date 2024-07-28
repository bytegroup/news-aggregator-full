import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'refresh_tokens' })
export class RefreshToken {
  @PrimaryColumn({ name: 'refresh_token' })
  refreshToken: string;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
