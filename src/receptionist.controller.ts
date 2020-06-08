import { Controller, Post, Get, Body, UseGuards, Request, Logger } from '@nestjs/common';
import { MapService } from './air/map.service';
import { ApiOperation } from '@nestjs/swagger';
import { CheckInDto, CheckOutDto } from "./dto";
import { UserService } from './user/user.service';
import { RoomService } from './air/room.service';


@Controller('receptionist')
export class ReceptionistController {
    constructor(
        private readonly mapService: MapService,
        private readonly userService: UserService,
        private readonly roomService: RoomService
    ) {

    }

    @ApiOperation({ description: '用户入住' })
    @Post('checkin')
    async checkIn(@Body() checkInDto: CheckInDto) {
        const userId = await this.userService.findIdByName(checkInDto.userName)
        const roomId = await this.roomService.findIdByName(checkInDto.roomName)
        this.mapService.checkIn(userId, roomId);
    }

    @ApiOperation({ description: '用户退房' })
    @Post('checkout')
    async checkOut(@Body() checkOutDto: CheckOutDto) {
        const userId = await this.userService.findIdByName(checkOutDto.userName)
        this.mapService.checkOut(userId);
    }
}