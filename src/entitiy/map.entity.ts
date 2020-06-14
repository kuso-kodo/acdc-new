import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MapEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userId: number;

  @Column({ unique: true })
  roomId: number;

  @Column()
  checkInDate: Date;
}
