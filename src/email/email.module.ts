import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailTemplate } from './template';

@Module({
  exports: [EmailService],
  providers: [EmailService, EmailTemplate],
})
export class EmailModule {}
