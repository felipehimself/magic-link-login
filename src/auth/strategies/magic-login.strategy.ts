import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-magic-login';
import { AuthService } from '../auth.service';
import { IValidateMagicLogin } from './../interfaces/validate-magic-login.interface';

@Injectable()
export class MagicLoginStrategy extends PassportStrategy(
  Strategy,
  'magic-link-strategy',
) {
  private readonly logger = new Logger(MagicLoginStrategy.name);

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      secret: configService.get('MAGIC_LINK_SECRET'),
      jwtOptions: {
        expiresIn: configService.get('MAGIC_LINK_EXPIRATION'),
      },
      callbackUrl: process.env.MAGIC_LINK_CALLBACK_URL,
      sendMagicLink: async (destionation: string, href: string) => {
        this.logger.debug(
          `Sending magic link to ${destionation} with href ${href}`,
        );

        await this.authService.sendMagicLinkEmail({
          email: destionation,
          url: href,
        });
      },
      verify: async (
        payload: { destination: string },
        callback: (
          err?: Error | null,
          user?: Promise<IValidateMagicLogin>,
          info?: any,
        ) => void,
      ) => callback(null, this.validate(payload)),
    });
  }

  async validate(payload: {
    destination: string;
  }): Promise<IValidateMagicLogin> {
    const user = await this.authService.validateUser(payload.destination);

    return user;
  }
}
