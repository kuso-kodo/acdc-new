import { ApiProperty } from '@nestjs/swagger';
import { FanSpeed } from 'src/entitiy/room.entity';

export class RegisterRoomDto {
    @ApiProperty({
        description: '房间名称',
    })
    room: string
}

export class RoomStatusDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    feeRate: number

    @ApiProperty()
    roomName: string

    @ApiProperty()
    isPowerOn: boolean

    @ApiProperty()
    isServicing: boolean

    @ApiProperty()
    currentTemperature: number

    @ApiProperty()
    targetTemperature: number

    @ApiProperty()
    fanSpeed: FanSpeed

    @ApiProperty()
    serviceTime: number
}