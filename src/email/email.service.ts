import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodeOutlook from 'nodejs-nodemailer-outlook';
import { EmailTemplate } from './template';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly EmailTemplate: EmailTemplate,
  ) {}
  private readonly logger = new Logger('EmailService');

  private frontendURL = this.configService.get('FRONTEND_URL');

  async sendEmailConfirmation(email: string, userId: string, codeConfirmation: string) {
    // const html = EmailTemplate.confirmAccountTemplate(userId, this.frontendURL);

    // try {
    //   await this.emailPromise(email, html, 'Confirm Your Account');
    // } catch (error) {
    //   throw new BadRequestException(
    //     'Something went wrong, try registering again in a few minutes'
    //   );
    // }

    this.logger.debug(
      `${this.frontendURL}/api/auth/confirm-account?userId=${userId}&codeConfirmation=${codeConfirmation}`,
    );
  }

  private async emailPromise(email: string, html: string, subject: string) {
    return new Promise((resolve, reject) => {
      nodeOutlook.sendEmail({
        auth: {
          user: this.configService.get('EMAIL_ACC'),
          pass: this.configService.get('EMAIL_PWD'),
        },
        from: this.configService.get('EMAIL_ACC'),
        to: email,
        subject: subject,
        html: html,
        onError: (e) => {
          reject(e);
        },
        onSuccess: (res) => {
          resolve(res);
        },
      });
    });
  }
}
