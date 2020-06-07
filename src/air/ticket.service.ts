import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { TicketEntity } from 'src/entitiy/ticket.entity';
import * as moment from 'moment';

export interface Bill {
    tickets: TicketEntity[]
    bill: number
}

enum ReportType {
    DAY, MONTH, YEAR
}

export interface Report {
    roomId: number
    totalTime: number
    serviceCount: number
    ticketCount: number
    fanChangeCount: number
    powerOnCount: number
    targetTemperatureChangedCount: number
    totalFee: number
}

@Injectable()
export class TicketService {
    constructor(
        @InjectRepository(TicketEntity) private ticketRepository: Repository<TicketEntity>) { }

    generateNewTicket(): TicketEntity {
        return this.ticketRepository.create();
    }

    async saveTicket(ticket: TicketEntity) {
        try {
            this.ticketRepository.save(ticket);
        } catch(err) {
            // Fuck.
        }
    }
    
    async getTicketsByUser(userId: number): Promise<TicketEntity[]> {
        return this.ticketRepository.find({userId: userId});
    }

    async getTicketsByRoom(roomId: number, startAt: Date): Promise<TicketEntity[]> {
        return this.ticketRepository.find({ 
            roomId: roomId,
            startAt: MoreThan(startAt)
        });
    }

    async getBillByUser(userId: number): Promise<Bill> {
        const tickets = await this.getTicketsByUser(userId);
        return {
            tickets: tickets,
            bill: tickets.reduce((l, r) => l + r.totalFee, 0.0)
        }
    }

    async getReportByRoom(roomId: number, reportType: ReportType): Promise<Report> {
        var date: Date;
        switch (reportType) {
            case ReportType.DAY:
                date = moment().subtract(1, 'days').toDate();
            case ReportType.MONTH:
                date = moment().subtract(1, 'months').toDate();
            case ReportType.YEAR:
                date = moment().subtract(1, 'years').toDate();
        }
        const tickets = await this.getTicketsByRoom(roomId, date);
        return {
            roomId: roomId,
            totalTime: tickets.reduce((l, r) => l + ((r.endAt.getTime() - r.startAt.getTime()) / 1000 / 60), 0),
            serviceCount: tickets.reduce((l, r) => l + r.serviceCount, 0),
            ticketCount: tickets.length,
            fanChangeCount: tickets.reduce((l, r) => l + (r.isFanSpeedChanged? 1 : 0), 0),
            powerOnCount: tickets.reduce((l, r) => l + (r.isShutDownEvent ? 1 : 0), 0),
            targetTemperatureChangedCount: tickets.reduce((l, r) => l + (r.isTargetTemperatureChanged ? 1 : 0), 0),
            totalFee: tickets.reduce((l, r) => l + r.totalFee, 0)
        };
    }
}