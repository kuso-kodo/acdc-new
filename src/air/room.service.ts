import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from 'src/entitiy/room.entity';
import { RegisterRoomDto } from 'src/dto';

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(RoomEntity) private roomRepository: Repository<RoomEntity>) {}

    async registerRoom(registerRoomDto: RegisterRoomDto) {
        const hasNoRoomRegistered = await this.roomRepository.count({ roomName: registerRoomDto.roomName }) == 0;
        if (hasNoRoomRegistered) {
            var newRoom = this.roomRepository.create();
            newRoom.roomName = registerRoomDto.roomName;
            this.roomRepository.save(newRoom);
        }
    }

    async findRoom(roomName: string): Promise<RoomEntity | undefined> {
        return this.roomRepository.findOne({ roomName: roomName });
    }

    async findIdByName(roomName: string): Promise<number | undefined> {
        const room = await this.roomRepository.findOne({ roomName: roomName });
        if (room) {
            return room.id
        }
        return undefined
    }
}