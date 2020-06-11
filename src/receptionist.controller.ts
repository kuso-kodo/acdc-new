import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { MapService } from './air/map.service';
import { ApiOperation } from '@nestjs/swagger';
import { CheckInDto, CheckOutDto } from "./dto";
import { UserService } from './user/user.service';
import { RoomService } from './air/room.service';
import { TicketService, Bill } from './air/ticket.service';
import { TicketEntity } from './entitiy/ticket.entity';


@Controller('receptionist')
export class ReceptionistController {
    constructor(
        private readonly mapService: MapService,
        private readonly userService: UserService,
        private readonly roomService: RoomService,
        private readonly ticketService: TicketService,
    ) {

    }

    @ApiOperation({ description: '用户入住' })
    @Post('checkin')
    async checkIn(@Body() checkInDto: CheckInDto) {
        const userId = await this.userService.findIdByName(checkInDto.userName)
        const roomId = await this.roomService.findIdByName(checkInDto.roomName)
        this.mapService.checkIn(roomId, userId);
    }

    @ApiOperation({ description: '用户退房' })
    @Post('checkout')
    async checkOut(@Body() checkOutDto: CheckOutDto) {
        const userId = await this.userService.findIdByName(checkOutDto.userName)
        this.mapService.checkOut(userId);
        this.ticketService.clearTicketByUser(userId);
    }

    async createRDR(userName: string): Promise<TicketEntity[]> {
        const userId = await this.userService.findIdByName(userName);
        if (!userId) {
            return [];
        }
        return this.ticketService.getTicketsByUser(userId);
    }

    @ApiOperation({ description: '创建详单 by 用户名' })
    @Get('rdr/:userName')
    async printRDR(@Param('userName') userName: string): Promise<TicketEntity[]> {
        return await this.createRDR(userName);
    }

    async createInvoice(userName: string): Promise<Bill> {
        var userId = await this.userService.findIdByName(userName);
        if (!userId) {
            userId = 0;
        }
        return this.ticketService.getBillByUser(userId);
    }

    @ApiOperation({ description: '创建详单 by 用户名' })
    @Get('invoice/:userName')
    async printInvoice(@Param('userName') userName: string): Promise<Bill> {
        return await this.createInvoice(userName);
    }
}