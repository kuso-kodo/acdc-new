import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { FanSpeed } from './room.entity'

@Entity()
export class TicketEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    roomId: number

    @Column()
    userId: number

    @Column()
    startAt: Date

    @Column()
    endAt: Date

    @Column()
    serviceCount: number

    @Column()
    fanSpeed: FanSpeed

    @Column({ type: 'float' })
    totalFee: number

    @Column()
    isPaid: boolean

    @Column()
    isShutDownEvent: boolean

    @Column()
    isFanSpeedChanged: boolean

    @Column()
    isPriorityChanged: boolean
}