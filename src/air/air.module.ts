import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketEntity } from "src/entitiy/ticket.entity";
import { RoomEntity } from "src/entitiy/room.entity";
import { MapEntity } from "src/entitiy/map.entity";
import { RoomService } from "./room.service";
import { MapService } from "./map.service";
import { AirService } from "./air.service";
import { ScheduleService } from "./schedule.service";
import { TicketService } from "./ticket.service";

@Module({
    imports: [TypeOrmModule.forFeature([TicketEntity, RoomEntity, MapEntity])],
    providers: [RoomService, MapService, AirService, ScheduleService, TicketService],
    exports: [RoomService, MapService, AirService, ScheduleService, TicketService]
})
export class AirModule { }