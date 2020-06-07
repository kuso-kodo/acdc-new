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

    @Column({ type: 'timestamp without time zone' })
    startAt: Date

    @Column({ type: 'timestamp without time zone' })
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
    isTargetTemperatureChanged: boolean
}