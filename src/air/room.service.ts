import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from 'src/entitiy/room.entity';
import { RegisterRoomDto } from 'src/dto';
import { RoomStatusDto } from 'src/dto/room.dto';

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(RoomEntity) private roomRepository: Repository<RoomEntity>) {}

    async registerRoom(registerRoomDto: RegisterRoomDto) {
        var newRoom = this.roomRepository.create();
        newRoom.roomName = registerRoomDto.roomName;
        try {
            await this.roomRepository.save(newRoom);
        } catch(err) {
            // Do nothing.
        }
    }

    async findRoom(roomName: string): Promise<RoomEntity | undefined> {
        return this.roomRepository.findOne({ roomName: roomName });
    }

    async findIdByName(roomName: string): Promise<number | undefined> {
        const room = await this.roomRepository.findOne({ roomName: roomName });
        if (room) {
            return room.id;
        }
        return undefined;
    }

    async updateRoomStatus(roomName: string, status: any) {
        const roomId = await this.findIdByName(roomName);
        if (roomId) {
            this.roomRepository.update({id: roomId}, status);
        }
    }

    async getRoomStatus(): Promise<RoomEntity[]> {
        const rooms = await this.roomRepository.find()
        return rooms
    }
}