import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapEntity } from 'src/entitiy/map.entity';
import { RoomEntity } from 'src/entitiy/room.entity';
import { TicketEntity } from 'src/entitiy/ticket.entity';
import { AirService } from './air.service';
import { MapService } from './map.service';
import { RoomService } from './room.service';
import { ScheduleService } from './schedule.service';
import { TicketService } from './ticket.service';

@Module({
  imports: [TypeOrmModule.forFeature([TicketEntity, RoomEntity, MapEntity])],
  providers: [
    RoomService,
    MapService,
    AirService,
    ScheduleService,
    TicketService,
  ],
  exports: [
    RoomService,
    MapService,
    AirService,
    ScheduleService,
    TicketService,
  ],
})
export class AirModule {}
