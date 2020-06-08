import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { ApiBody, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto, RegisterRoomDto } from './dto';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RoomService } from './air/room.service';
import { AirService } from './air/air.service';
import { MapService } from './air/map.service';
import { TicketService } from './air/ticket.service';

@Controller()
export class CustomerController {
    constructor(
        public readonly roomService: RoomService,
        public readonly airService: AirService,
        public readonly mapService: MapService,
        public readonly ticketService: TicketService
    ) {

    }

    @ApiOperation({ description: '注册房间号' })
    @Post('api/register')
    async login(@Body() registerRoomDto: RegisterRoomDto): Promise<any> {
        this.roomService.registerRoom(registerRoomDto);
        return {
            status: true,
            period: 60,
            msg: '.'
        }
    }
}