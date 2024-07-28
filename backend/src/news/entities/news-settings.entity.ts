import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('news_settings')
export class NewsSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: false, nullable: true })
  source: string | null;

  @Column({ unique: false, nullable: true })
  searchkey: string | null;

  @Column({ unique: false, nullable: true })
  tags: string | null;

  @Column({ unique: false, nullable: false })
  userId: number;
}
