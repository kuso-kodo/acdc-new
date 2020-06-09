import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { FanSpeed } from './room.entity'
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class TicketEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    roomId: number

    @ApiProperty()
    @Column()
    userId: number

    @ApiProperty()
    @Column({ type: 'timestamp without time zone' })
    startAt: Date

    @ApiProperty()
    @Column({ type: 'timestamp without time zone' })
    endAt: Date

    @ApiProperty()
    @Column()
    serviceCount: number

    @ApiProperty()
    @Column()
    fanSpeed: FanSpeed

    @ApiProperty()
    @Column({ type: 'float' })
    totalFee: number

    @ApiProperty()
    @Column()
    isPaid: boolean

    @ApiProperty()
    @Column()
    isShutDownEvent: boolean

    @ApiProperty()
    @Column()
    isFanSpeedChanged: boolean

    @ApiProperty()
    @Column()
    isTargetTemperatureChanged: boolean
}