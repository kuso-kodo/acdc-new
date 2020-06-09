import { ApiProperty } from '@nestjs/swagger';

export class ReportRequestDto {
    @ApiProperty({description: '日报 = 0， 月报= 1， 年报= 2'})
    reportType: string;
}