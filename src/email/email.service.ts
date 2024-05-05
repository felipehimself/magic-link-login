import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodeOutlook from 'nodejs-nodemailer-outlook';
import { EmailTemplate } from './template';
import { ISendMagicLink } from 'src/shared/interfaces/send-magic-link.interface';
import { ISendEmailConfirmation } from './interfaces/send-email-confirmaton.interface';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly EmailTemplate: EmailTemplate,
  ) {}
  private readonly logger = new Logger('EmailService');

  private frontendURL = this.configService.get('FRONTEND_URL');
  private emailAccount = this.configService.get('EMAIL_ACC');
  private emailPassword = this.configService.get('EMAIL_PWD');

  async sendEmailConfirmation({
    email,
    userId,
    codeConfirmation,
  }: ISendEmailConfirmation) {
    const url = `${this.frontendURL}/confirm-account?userId=${userId}&codeConfirmation=${codeConfirmation}`;

    const html = EmailTemplate.confirmAccountTemplate(url);

    try {
      await this.emailPromise(
        email,
        html,
        'Magic Link Login - Confirm Your Account',
      );
    } catch (error) {
      throw new BadRequestException(
        'Something went wrong, try registering again in a few minutes',
      );
    }

    this.logger.debug(`Sending email to ${email} with link: ${url}`);
  }

  async sendMagicLinkEmail({ email, url }: ISendMagicLink) {
    const html = EmailTemplate.magicLinkTemplate(url);

    try {
      await this.emailPromise(
        email,
        html,
        'Magic Link Login - Login to your Account',
      );
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(
        'Something went wrong, try registering again in a few minutes',
      );
    }

    this.logger.debug(`Sending magic link email to ${email} with link: ${url}`);
  }

  private async emailPromise(email: string, html: string, subject: string) {
    return new Promise((resolve, reject) => {
      nodeOutlook.sendEmail({
        auth: {
          user: this.emailAccount,
          pass: this.emailPassword,
        },
        from: this.emailAccount,
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
