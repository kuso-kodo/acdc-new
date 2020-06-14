import { ApiProperty } from '@nestjs/swagger';

export class ReportRequestDto {
  @ApiProperty({ description: '日报 = 0，周报 = 1，月报= 2， 年报= 3' })
  reportType: string;
}
