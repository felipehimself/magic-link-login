import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { addMinutes } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CronService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private prisma: PrismaService,
  ) {}
  private readonly logger = new Logger('CRON LOGGER');

  message = this.createMessage();

  jobToDeleteNotConfirmedAccount(userId: string) {
    const { minute, hour, day } = this.generateCronTime();

    const job = new CronJob(`${minute} ${hour} * * ${day}`, async () => {
      const user = await this.prisma.users.findUnique({
        where: {
          id: userId,
        },
        include: {
          account_confirmed: true,
        },
      });

      if (!user?.account_confirmed?.confirmed) {
        await this.prisma.users.delete({
          where: {
            id: userId,
          },
        });

        this.message = this.createMessage('user deleted');
      }

      this.logger.warn(this.message);

      this.deleteJob(userId);
    });

    this.logger.warn(`Job ${userId} created!`);
    this.schedulerRegistry.addCronJob(userId, job);
    job.start();
  }

  private generateCronTime(minutes = 15) {
    const week = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    const now = new Date();
    const minutesFromNow = addMinutes(now, minutes);

    const minute = new Date(minutesFromNow).getMinutes();
    const hour = new Date(minutesFromNow).getHours();
    const weekDay = new Date(minutesFromNow).getDay();

    return { minute, hour, day: week[weekDay] };
  }

  private deleteJob(jobName: string) {
    this.schedulerRegistry.deleteCronJob(jobName);
    this.logger.warn(`Job ${jobName} deleted!`);
  }

  private createMessage(message = 'user confirmed') {
    return `Job to delete user register from table has finished, status: ${message}`;
  }
}
