import { ApiProperty } from '@nestjs/swagger';

export enum AirMode {
    HOT = 0, 
    COLD = 1
}

export class ParamaterDto {
    @ApiProperty()
    mode: AirMode // Fucking useless

    @ApiProperty()
    lowTemperature: number // Fucking useless

    @ApiProperty()
    highTemperature: number // Fucking useless

    @ApiProperty()
    defaultTargetTemperature: number // Fucking useless

    @ApiProperty()
    feeRatePerCelsius: number
}