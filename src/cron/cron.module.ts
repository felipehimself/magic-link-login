import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CronService } from './cron.service';
@Module({
  imports: [PrismaModule, ScheduleModule.forRoot()],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
