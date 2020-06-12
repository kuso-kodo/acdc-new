import { Injectable, Logger } from '@nestjs/common'
import { ScheduleDto } from 'src/dto/schedule.dto'
import { AirService } from './air.service';
import { AirMode } from 'src/dto/air.dto';

@Injectable()
export class ScheduleService {
    private waitQueue: ScheduleDto[];
    private runningQueueLimit: number;
    private doneQueue: ScheduleDto[];

    constructor(private readonly airService: AirService) {
        this.waitQueue = [];
        this.runningQueueLimit = 3;
        this.doneQueue = [];
    }

    setRunningQueueLimit(limit: number) {
        this.runningQueueLimit = limit;
    }

    sortWaitQueue() {
        this.waitQueue.sort((a, b) => {
            if (a.priority < b.priority) {
                return 1;
            } else if (a.priority > b.priority) {
                return -1;
            }

            return a.startAt - b.startAt;
        })
    }

    migrateDoneQueueToWaitQueue() {
        const waitDtos = this.doneQueue.filter(i => Math.abs(i.targetTemperature - i.currentTemperature) > 1);
        this.doneQueue = this.doneQueue.filter(i => !(Math.abs(i.targetTemperature - i.currentTemperature) > 1))
        waitDtos.forEach(i => this.waitQueue.push(i));
        this.sortWaitQueue();
    }

    insertNewSchedule(scheduleDto: ScheduleDto) {
        this.waitQueue.push(scheduleDto);
        this.sortWaitQueue();
    }

    findScheduleById(roomId: number): undefined | ScheduleDto {
        var dto = this.waitQueue.find(i => i.roomId == roomId)
        if(dto) {
            return dto
        }
        return this.doneQueue.find(i => i.roomId == roomId)
    }

    insertOrUpdateScheduleById(roomId: number, currentTemperature: number, targetTemperature: number, priority: number) {
        var index = this.waitQueue.findIndex(i => i.roomId == roomId)
        if(index != -1) {
            this.waitQueue[index].currentTemperature = currentTemperature;
            this.waitQueue[index].targetTemperature = targetTemperature;
            this.waitQueue[index].priority = priority; 
            var currentTemperatureExceed = false
            if (this.airService.getPara().mode == AirMode.COLD) {
                currentTemperatureExceed = currentTemperature > targetTemperature;
            } else {
                currentTemperatureExceed = currentTemperature < targetTemperature;
            }
            if (Math.abs(currentTemperature - targetTemperature) < 0.1 || currentTemperatureExceed) {
                this.doneQueue.push(this.waitQueue[index]);
                this.waitQueue = this.waitQueue.filter(i => i.roomId != roomId)
            }
            this.sortWaitQueue();
            return;
        }
        index = this.doneQueue.findIndex(i => i.roomId == roomId)
        if (index != -1) {
            this.doneQueue[index].currentTemperature = currentTemperature;
            this.doneQueue[index].targetTemperature = targetTemperature;
            this.doneQueue[index].priority = priority;
            this.migrateDoneQueueToWaitQueue();
            return;
        }
        var dto = new ScheduleDto()
        dto.roomId = roomId;
        dto.startTemperature = currentTemperature;
        dto.currentTemperature = currentTemperature;
        dto.targetTemperature = targetTemperature;
        dto.startAt = new Date().getTime()
        dto.priority = priority;
        dto.serviceCount = 0;
        this.insertNewSchedule(dto);
    }

    isRoomInService(roomId: number): boolean {
        var index = this.waitQueue.findIndex(i => i.roomId == roomId);
        if(index == -1) {
            return false;
        }
        if (index < this.runningQueueLimit) {
            var dto = this.waitQueue[index];
            dto.startAt = new Date().getTime();
            dto.serviceCount = dto.serviceCount + 1;
            this.waitQueue = this.waitQueue.filter(i => i.roomId != roomId);
            this.waitQueue.push(dto);
            this.sortWaitQueue();
        }
        Logger.log(this.waitQueue);
        return index < this.runningQueueLimit;
    }

    removeSchedule(roomId: number) {
        this.waitQueue = this.waitQueue.filter(i => i.roomId != roomId);
        this.doneQueue = this.doneQueue.filter(i => i.roomId != roomId);
    }
}