import { ApiProperty } from '@nestjs/swagger';

export enum AirMode {
    COLD = 0, 
    HOT = 1
}

export class ParamaterDto {
    @ApiProperty()
    mode: AirMode
    @ApiProperty()
    lowTemperature: number
    @ApiProperty()
    highTemperature: number

    @ApiProperty()
    defaultTargetTemperature: number

    @ApiProperty()
    feeRatePerCelsius: number
}