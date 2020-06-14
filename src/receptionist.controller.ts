import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { MapService } from './air/map.service';
import { ApiOperation } from '@nestjs/swagger';
import { CheckInDto, CheckOutDto } from './dto';
import { UserService } from './user/user.service';
import { RoomService } from './air/room.service';
import { TicketService, Bill } from './air/ticket.service';
import { TicketEntity } from './entitiy/ticket.entity';
import { AirService } from './air/air.service';

@Controller('receptionist')
export class ReceptionistController {
  constructor(
    private readonly airService: AirService,
    private readonly mapService: MapService,
    private readonly userService: UserService,
    private readonly roomService: RoomService,
    private readonly ticketService: TicketService,
  ) {}

  @ApiOperation({ description: '用户入住' })
  @Post('checkin')
  async checkIn(@Body() checkInDto: CheckInDto) {
    const userId = await this.userService.findIdByName(checkInDto.userName);
    const roomId = await this.roomService.findIdByName(checkInDto.roomName);
    this.mapService.checkIn(roomId, userId);
  }

  @ApiOperation({ description: '用户退房' })
  @Post('checkout')
  async checkOut(@Body() checkOutDto: CheckOutDto) {
    const userId = await this.userService.findIdByName(checkOutDto.userName);
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
    if (!userName) {
      return [];
    }
    return await this.createRDR(userName);
  }

  async createInvoice(userName: string): Promise<Bill> {
    var userId = await this.userService.findIdByName(userName);
    if (!userId) {
      userId = 0;
    }
    var bill = await this.ticketService.getBillByUser(userId);
    bill.checkInTime = await this.mapService.getCheckInTimeByUser(userId);
    bill.feeRate = this.airService.getPara().feeRatePerCelsius;
    return bill;
  }

  @ApiOperation({ description: '创建详单 by 用户名' })
  @Get('invoice/:userName')
  async printInvoice(@Param('userName') userName: string): Promise<Bill> {
    if (!userName) {
      var bill = new Bill();
      bill.bill = 0;
      bill.checkInTime = new Date();
      bill.tickets = [];
      return bill;
    }
    return await this.createInvoice(userName);
  }

  async createRDRByRoom(roomName: string): Promise<TicketEntity[]> {
    var roomId = await this.roomService.findIdByName(roomName);
    if (!roomId) {
      return [];
    }
    return this.ticketService.getAllTicketsByRoom(roomId);
  }

  @ApiOperation({ description: '创建详单 by 房间名' })
  @Get('room/rdr/:roomName')
  async printRDRByRoom(
    @Param('roomName') roomName: string,
  ): Promise<TicketEntity[]> {
    if (!roomName) {
      return [];
    }
    return await this.createRDRByRoom(roomName);
  }

  async createInvoiceByRoom(roomName: string): Promise<Bill> {
    var roomId = await this.roomService.findIdByName(roomName);
    if (!roomId) {
      var bill = new Bill();
      bill.bill = 0;
      bill.checkInTime = new Date();
      bill.tickets = [];
      return bill;
    }
    var bill = await this.ticketService.getBillByRoom(roomId);
    bill.checkInTime = await this.mapService.getCheckInTimeByRoom(roomId);
    bill.feeRate = this.airService.getPara().feeRatePerCelsius;
    return bill;
  }

  @ApiOperation({ description: '创建详单 by 房间名' })
  @Get('room/invoice/:roomName')
  async printInvoiceByRoom(@Param('roomName') roomName: string): Promise<Bill> {
    if (!roomName) {
      var bill = new Bill();
      bill.bill = 0;
      bill.checkInTime = new Date();
      bill.tickets = [];
      return bill;
    }
    return await this.createInvoice(roomName);
  }
}
