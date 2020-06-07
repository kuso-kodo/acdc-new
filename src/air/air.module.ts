import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketEntity } from "src/entitiy/ticket.entity";
import { RoomEntity } from "src/entitiy/room.entity";
import { MapEntity } from "src/entitiy/map.entity";
import { RoomService } from "./room.service";

@Module({
    imports: [TypeOrmModule.forFeature([TicketEntity, RoomEntity, MapEntity])],
    providers: [RoomService],
    exports: [RoomService]
})
export class AirModule { }