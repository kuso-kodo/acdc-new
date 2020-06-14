import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MapEntity } from 'src/entitiy/map.entity';
import * as moment from 'moment';

@Injectable()
export class MapService {
  constructor(
    @InjectRepository(MapEntity) private mapRepository: Repository<MapEntity>,
  ) {}

  async findRoomByUser(userId: number): Promise<number | undefined> {
    const map = await this.mapRepository.findOne({ userId: userId });
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
    return undefined;
  }

  async getCheckInTimeByUser(userId: number) {
    const map = await this.mapRepository.findOne({ userId: userId });
    if (map) {
      return map.checkInDate;
    }
    return moment().toDate();
  }

  async getCheckInTimeByRoom(roomId: number) {
    const map = await this.mapRepository.findOne({ roomId: roomId });
    if (map) {
      return map.checkInDate;
    }
    return moment().toDate();
  }

  async checkIn(roomId: number, userId: number) {
    var map = this.mapRepository.create();
    map.roomId = roomId;
    map.userId = userId;
    map.checkInDate = moment().toDate();
    try {
      await this.mapRepository.save(map);
    } catch (err) {
      // Nothing.
    }
  }

  async checkOut(userId: number) {
    this.mapRepository.delete({ userId: userId });
  }
}
