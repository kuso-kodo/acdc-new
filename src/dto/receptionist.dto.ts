import { ApiProperty } from '@nestjs/swagger';

export class CheckInDto {
  @ApiProperty()
  roomName: string;
  @ApiProperty()
  userName: string;
}

export class CheckOutDto {
  @ApiProperty()
  userName: string;
}
