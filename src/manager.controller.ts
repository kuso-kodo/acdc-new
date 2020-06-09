import { Controller, Post, Get, Body, Param, Query, Logger } from '@nestjs/common';
import { MapService } from './air/map.service';
import { ApiOperation } from '@nestjs/swagger';
import { CheckInDto, CheckOutDto } from "./dto";
import { UserService } from './user/user.service';
import { RoomService } from './air/room.service';
import { TicketService, Bill, Report } from './air/ticket.service';
import { TicketEntity } from './entitiy/ticket.entity';
import { AirService } from './air/air.service';
import { ParamaterDto } from './dto/air.dto';
import { RoomStatusDto } from './dto/room.dto';
import { ReportRequestDto } from './dto/manager.dto';


@Controller('manager')
export class ManagerController {
    constructor(
        private readonly ticketService: TicketService,
        private readonly roomService: RoomService) { }

    @ApiOperation({ description: '获取报表' })
    @Get('report')
    async checkRoomState(@Query() req: ReportRequestDto): Promise<Report[]> {
        Logger.log(req);
        const rooms = await this.roomService.getRooms();
        var result: Report[] = []
        for (var i = 0; i < rooms.length; i++) {
            result.push(await this.ticketService.getReportByRoom(rooms[i].id, Number(req.reportType)));
        }
        return result
    }
}