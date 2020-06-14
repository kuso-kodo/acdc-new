import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AirService } from './air/air.service';
import { ParamaterDto } from './dto/air.dto';
import { RoomStatusDto } from './dto/room.dto';

@Controller('matainer')
export class MatainerController {
  constructor(private readonly airService: AirService) {}

  @ApiOperation({ description: '开机' })
  @Get('poweron')
  powerOn() {
    this.airService.powerOn();
  }

  @ApiOperation({ description: '开始服务' })
  @Get('startup')
  startUp() {
    this.airService.startUp();
  }

  @ApiOperation({ description: '设置参数' })
  @Post('param')
  setPara(@Body() param: ParamaterDto) {
    this.airService.setPara(param);
  }

  @ApiOperation({ description: '空调状态' })
  @Get('state')
  checkRoomState(): Promise<RoomStatusDto[]> {
    return this.airService.getRoomStatus();
  }
}
