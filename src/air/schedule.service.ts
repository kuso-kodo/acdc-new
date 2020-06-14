import { Injectable, Logger } from '@nestjs/common';
import { ScheduleDto } from 'src/dto/schedule.dto';
import { AirService } from './air.service';
import { AirMode } from 'src/dto/air.dto';
import { RoomService } from './room.service';

@Injectable()
export class ScheduleService {
  private runningQueue: ScheduleDto[];
  private waitQueue: ScheduleDto[];
  private runningQueueLimit: number;
  private doneQueue: ScheduleDto[];

  constructor(
    private readonly airService: AirService,
    private readonly roomService: RoomService,
  ) {
    this.waitQueue = [];
    this.runningQueue = [];
    this.runningQueueLimit = 3;
    this.doneQueue = [];
  }

  setRunningQueueLimit(limit: number) {
    this.runningQueueLimit = limit;
  }

  sortWaitQueue() {
    this.waitQueue.sort((a, b) => {
      if (a.priority > b.priority) {
        return 1;
      } else if (a.priority < b.priority) {
        return -1;
      }

      return b.startAt - a.startAt;
    });
  }

  migrateDoneQueueToWaitQueue() {
    const waitDtos = this.doneQueue.filter(
      (i) => Math.abs(i.targetTemperature - i.currentTemperature) > 1,
    );
    this.doneQueue = this.doneQueue.filter(
      (i) => !(Math.abs(i.targetTemperature - i.currentTemperature) > 1),
    );
    waitDtos.forEach((i) => this.waitQueue.push(i));
    this.migrateToRunningQueue();
  }

  migrateToRunningQueue() {
    this.sortWaitQueue();
    while (
      this.runningQueue.length < this.runningQueueLimit &&
      this.waitQueue.length > 0
    ) {
      var temp = this.waitQueue.pop();
      temp.touched = false;
      this.runningQueue.push(temp);
    }
  }

  migrateToDoneQueue() {
    this.waitQueue.sort((a, b) => {
      return (
        Math.abs(b.currentTemperature - b.targetTemperature) -
        Math.abs(a.currentTemperature - a.targetTemperature)
      );
    });
    while (this.waitQueue.length > 0) {
      var temp = this.waitQueue.pop();
      if (Math.abs(temp.currentTemperature - temp.targetTemperature) <= 0.1) {
        this.doneQueue.push(temp);
      } else {
        this.waitQueue.push(temp);
        return;
      }
    }
  }

  inRunningQueue(roomId: number) {
    return this.runningQueue.findIndex((i) => i.roomId == roomId) != -1;
  }

  insertNewSchedule(scheduleDto: ScheduleDto) {
    this.waitQueue.push(scheduleDto);
    this.migrateToDoneQueue();
    this.migrateToRunningQueue();
  }

  findScheduleById(roomId: number): undefined | ScheduleDto {
    var dto = this.runningQueue.find((i) => i.roomId == roomId);
    if (dto) {
      return dto;
    }
    var dto = this.waitQueue.find((i) => i.roomId == roomId);
    if (dto) {
      return dto;
    }
    return this.doneQueue.find((i) => i.roomId == roomId);
  }

  insertOrUpdateScheduleById(
    roomId: number,
    currentTemperature: number,
    targetTemperature: number,
    priority: number,
  ) {
    var index = this.runningQueue.findIndex((i) => i.roomId == roomId);
    if (index != -1) {
      this.runningQueue[index].currentTemperature = currentTemperature;
      this.runningQueue[index].targetTemperature = targetTemperature;
      this.runningQueue[index].priority = priority;
      return;
    }
    var index = this.waitQueue.findIndex((i) => i.roomId == roomId);
    if (index != -1) {
      this.waitQueue[index].currentTemperature = currentTemperature;
      this.waitQueue[index].targetTemperature = targetTemperature;
      this.waitQueue[index].priority = priority;
      if (Math.abs(currentTemperature - targetTemperature) < 0.1) {
        this.doneQueue.push(this.waitQueue[index]);
        this.waitQueue = this.waitQueue.filter((i) => i.roomId != roomId);
      }
      this.migrateToRunningQueue();
      return;
    }
    index = this.doneQueue.findIndex((i) => i.roomId == roomId);
    if (index != -1) {
      this.doneQueue[index].currentTemperature = currentTemperature;
      this.doneQueue[index].targetTemperature = targetTemperature;
      this.doneQueue[index].priority = priority;
      this.migrateDoneQueueToWaitQueue();
      return;
    }
    var dto = new ScheduleDto();
    dto.roomId = roomId;
    dto.startTemperature = currentTemperature;
    dto.currentTemperature = currentTemperature;
    dto.targetTemperature = targetTemperature;
    dto.startAt = new Date().getTime();
    dto.priority = priority;
    dto.serviceCount = 0;
    this.insertNewSchedule(dto);
  }

  isRoomInService(roomId: number): boolean {
    var index = this.runningQueue.findIndex((i) => i.roomId == roomId);
    var dto = this.runningQueue.find((i) => i.roomId == roomId);
    if (!dto) {
      this.roomService.updateRoomIsServicing(roomId, false);
      return false;
    }
    if (dto.touched) {
      this.runningQueue = this.runningQueue.filter((i) => i.roomId != roomId);
      dto.startAt = new Date().getTime();
      this.insertNewSchedule(dto);
      return this.isRoomInService(roomId);
    } else {
      this.runningQueue[index].touched = true;
      this.runningQueue[index].serviceCount += 1;
      this.roomService.updateRoomIsServicing(roomId, true);
      return true;
    }
  }

  removeSchedule(roomId: number) {
    this.runningQueue = this.waitQueue.filter((i) => i.roomId != roomId);
    this.waitQueue = this.waitQueue.filter((i) => i.roomId != roomId);
    this.doneQueue = this.doneQueue.filter((i) => i.roomId != roomId);
    this.migrateToRunningQueue();
  }
}
