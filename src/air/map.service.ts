import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MapEntity } from 'src/entitiy/map.entity';

@Injectable()
export class MapService {
    constructor(
        @InjectRepository(MapEntity) private mapRepository: Repository<MapEntity>) { }

    async findRoomByUser(userId: number): Promise<number | undefined> {
        const map = await this.mapRepository.findOne({ userId: userId});
        if (map) {
            return map.roomId;
        }
        return undefined;
    }

    async findUserByRoom(roomId: number): Promise<number | undefined> {
        const map = await this.mapRepository.findOne({ roomId: roomId });
        if (map) {
            return map.userId;
        }
        Logger.log(map);
        return undefined;
    }

    async checkIn(roomId: number, userId: number) {
        var map = this.mapRepository.create();
        map.roomId = roomId;
        map.userId = userId;
        try {
            await this.mapRepository.save(map);
        } catch(err) {
            // Nothing.
        }
    }

    async checkOut(userId: number) {
        this.mapRepository.delete({userId: userId})
    }
}