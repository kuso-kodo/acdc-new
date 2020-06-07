import { Injectable } from '@nestjs/common'
import { ParamaterDto } from 'src/dto/air.dto'

@Injectable()
export class AirService {
    private parameter: ParamaterDto;

    constructor() {
        this.parameter = new ParamaterDto()
    }

    setPara(parameter: ParamaterDto) {
        this.parameter = parameter
    }

    powerOn() {
        // Dummy function, make our motherfucking stupid, arrogant teacher happy.
        return;
    }

    startUp() {
        // Same.
        return;
    }
}