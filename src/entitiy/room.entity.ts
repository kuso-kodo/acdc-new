import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export type FanSpeed = 1 | 2 | 3;

@Entity()
export class RoomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  roomName: string;

  @Column()
  isPowerOn: boolean;

  @Column()
  isServicing: boolean;

  @Column({ type: 'float' })
  currentTemperature: number;

  @Column({ type: 'float' })
  targetTemperature: number;

  @Column({ type: 'int' })
  fanSpeed: FanSpeed;

  @Column()
  lastOnTime: Date;
}
