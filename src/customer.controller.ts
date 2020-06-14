import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AirService } from './air/air.service';
import { MapService } from './air/map.service';
import { RoomService } from './air/room.service';
import { ScheduleService } from './air/schedule.service';
import { TicketService } from './air/ticket.service';
import { RegisterRoomDto } from './dto';
import { HeartBeatRequestDto, HeartBeatResponseDto } from './dto/heartbeat.dto';

@Controller()
export class CustomerController {
  constructor(
    public readonly roomService: RoomService,
    public readonly airService: AirService,
    public readonly scheduleService: ScheduleService,
    public readonly mapService: MapService,
    public readonly ticketService: TicketService,
  ) {}

  @ApiOperation({ description: '注册房间号' })
  @Post('api/register')
  async login(@Body() registerRoomDto: RegisterRoomDto): Promise<any> {
    this.roomService.registerRoom(registerRoomDto);
    const param = this.airService.getPara();
    return {
      status: true,
      peroid: 30,
      mode: param.mode,
      lowTemperatureLimit: param.lowTemperature,
      highTemperatureLimit: param.highTemperature,
      defaultTargetTemperature: param.defaultTargetTemperature,
      msg: '.',
    };
  }

  @ApiOperation({ description: '处理心跳包' })
  @Post('api/heartbeat')
  async heartbeat(
    @Body() heartBeat: HeartBeatRequestDto,
  ): Promise<HeartBeatResponseDto> {
    const room = await this.roomService.findRoom(heartBeat.room);
    this.roomService.updateRoomStatus(heartBeat);
    const schedule = await this.scheduleService.findScheduleById(room.id);
    let userId = await this.mapService.findUserByRoom(room.id);
    const ticket = this.ticketService.generateNewTicket();
    if (!userId) {
      userId = 0;
    }
    const previousFee = await this.ticketService.getBillByUser(userId);

    if (room.isPowerOn == false && heartBeat.power == false) {
      var response = new HeartBeatResponseDto();
      response.cost = previousFee.bill;
      response.status = 0;
      response.wind = false;
      response.msg = '';
      return response;
    }

    // Client is on.
    if (room.isPowerOn == false && heartBeat.power == true) {
      this.scheduleService.insertOrUpdateScheduleById(
        room.id,
        heartBeat.current,
        heartBeat.target,
        heartBeat.wind,
      );
      var response = new HeartBeatResponseDto();
      response.cost = previousFee.bill;
      response.status = 0;
      response.wind = this.scheduleService.isRoomInService(room.id);
      response.msg = '';
      return response;
    }

    ticket.roomId = room.id;
    ticket.roomName = room.roomName;
    ticket.userId = userId;
    ticket.startAt = schedule ? new Date(schedule.startAt) : new Date();
    ticket.endAt = new Date();
    ticket.serviceCount = schedule ? schedule.serviceCount : 0;
    ticket.totalFee = schedule
      ? Math.abs(schedule.startTemperature - heartBeat.current) *
        this.airService.getPara().feeRatePerCelsius
      : 0;
    ticket.feeRate = this.airService.getPara().feeRatePerCelsius;
    ticket.fanSpeed = room.fanSpeed;
    ticket.isPaid = false;
    ticket.isFanSpeedChanged = false;
    ticket.isTargetTemperatureChanged = false;
    ticket.isShutDownEvent = false;

    // Client is off
    if (room.isPowerOn == true && heartBeat.power == false) {
      ticket.isShutDownEvent = true;
      this.ticketService.saveTicket(ticket);
      this.scheduleService.removeSchedule(room.id);
      var response = new HeartBeatResponseDto();
      response.cost = ticket.totalFee + previousFee.bill;
      response.status = 0;
      response.wind = false;
      response.msg = '';
      return response;
    }
    // On
    const isSpeddChanged = heartBeat.wind != room.fanSpeed;
    const isTargetChanged = heartBeat.target != room.targetTemperature;

    ticket.isFanSpeedChanged = isSpeddChanged;
    ticket.isTargetTemperatureChanged = isTargetChanged;
    if (isSpeddChanged || isTargetChanged) {
      this.ticketService.saveTicket(ticket);
      this.scheduleService.removeSchedule(room.id);
      this.scheduleService.insertOrUpdateScheduleById(
        room.id,
        heartBeat.current,
        heartBeat.target,
        heartBeat.wind,
      );
    } else {
      this.scheduleService.insertOrUpdateScheduleById(
        room.id,
        heartBeat.current,
        heartBeat.target,
        heartBeat.wind,
      );
    }

    var response = new HeartBeatResponseDto();
    response.cost = ticket.totalFee + previousFee.bill;
    response.status = 0;
    response.wind = this.scheduleService.isRoomInService(room.id);
    response.msg = '';
    return response;
  }
}
