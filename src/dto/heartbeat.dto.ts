import { ApiProperty } from '@nestjs/swagger';
import { FanSpeed } from 'src/entitiy/room.entity';

export class HeartBeatRequestDto {
  @ApiProperty({ description: '用以区分房间，最好使用房间号等有意义的 ID' })
  room: string;

  @ApiProperty({ description: '用以标识当前空调是否打开（true 为开启）' })
  power: boolean;

  @ApiProperty({ description: '用以标识当前空调的状态（0 为制冷， 1 为制热）' })
  mode: number;

  @ApiProperty({ description: '当前空调的目标温度 取值范围 10°C ~ 30°C' })
  target: number;

  @ApiProperty({ description: '室内当前温度 由客户端模拟' })
  current: number;

  @ApiProperty({ description: '当前风力等级，从 1 到 3 分别表示 低-中-高' })
  wind: FanSpeed;
}

export type Status = 0 | 1;

export class HeartBeatResponseDto {
  @ApiProperty({ description: '状态，详见下面的解释' })
  status: number;

  @ApiProperty({ description: '是否送风' })
  wind: boolean;

  @ApiProperty({ description: '累计金额' })
  cost: number;

  @ApiProperty({ description: '错误信息' })
  msg: string;
}
