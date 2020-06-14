import { Injectable } from '@nestjs/common';
import { ParamaterDto, AirMode } from 'src/dto/air.dto';
import { RoomService } from './room.service';
import { RoomStatusDto } from 'src/dto/room.dto';
import * as moment from 'moment';

@Injectable()
export class AirService {
  private parameter: ParamaterDto;

  constructor(private roomService: RoomService) {
    this.parameter = new ParamaterDto();
    this.parameter.feeRatePerCelsius = 1;
    this.parameter.lowTemperature = 18;
    this.parameter.highTemperature = 28;
    this.parameter.defaultTargetTemperature = 25;
    this.parameter.mode = AirMode.COLD;
  }

  setPara(parameter: ParamaterDto) {
    this.parameter = parameter;
  }

  getPara(): ParamaterDto {
    return this.parameter;
  }

  powerOn() {
    // Dummy function, make our motherfuckingly stupid, arrogant teacher happy.
    return;
  }

  startUp() {
    // Same.
    return;
  }

  async getRoomStatus(): Promise<RoomStatusDto[]> {
    return (await this.roomService.getRoomStatus()).map((room) => {
      var dto = new RoomStatusDto();
      dto.id = room.id;
      dto.feeRate = this.parameter.feeRatePerCelsius;
      dto.roomName = room.roomName;
      dto.currentTemperature = room.currentTemperature;
      dto.targetTemperature = room.targetTemperature;
      dto.isPowerOn = room.isPowerOn;
      dto.isServicing = room.isServicing;
      dto.fanSpeed = room.fanSpeed;
      dto.serviceTime = room.isPowerOn
        ? moment().toDate().getTime() - room.lastOnTime.getTime()
        : 0;
      return dto;
    });
  }
}
