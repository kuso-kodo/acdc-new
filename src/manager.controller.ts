import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { RoomService } from './air/room.service';
import { Report, TicketService } from './air/ticket.service';
import { ReportRequestDto } from './dto/manager.dto';

@Controller('manager')
export class ManagerController {
  constructor(
    private readonly ticketService: TicketService,
    private readonly roomService: RoomService,
  ) {}

  @ApiOperation({ description: '获取报表' })
  @Get('report')
  async checkRoomState(@Query() req: ReportRequestDto): Promise<Report[]> {
    const rooms = await this.roomService.getRooms();
    const result: Report[] = [];
    for (let i = 0; i < rooms.length; i++) {
      result.push(
        await this.ticketService.getReportByRoom(
          rooms[i].id,
          rooms[i].roomName,
          Number(req.reportType),
        ),
      );
    }
    return result;
  }
}
