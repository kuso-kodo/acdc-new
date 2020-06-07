import { ApiProperty } from '@nestjs/swagger';

export class RegisterRoomDto {
    @ApiProperty({
        description: '房间名称',
    })
    roomName: string
}