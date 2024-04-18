import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-magic-login';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class MagicLoginStrategy extends PassportStrategy(
  Strategy,
  'magic-link-strategy',
) {
  private readonly logger = new Logger(MagicLoginStrategy.name);

  constructor(private authService: AuthService) {
    super({
      secret: process.env.MAGIC_LINK_SECRET,
      jwtOptions: {
        expiresIn: '5m',
      },
      callbackUrl: process.env.MAGIC_LINK_CALLBACK_URL,
      sendMagicLink: async (destionation: string, href: string) => {
        this.logger.debug(
          `Sending magic link to ${destionation} with href ${href}`,
        );

        // TODO:
        // send the email...
      },
      verify: async (payload: { destination: string }, callback: (err?: Error | null, user?: User, info?: any) => void, ) => callback(null, this.validate(payload)),
    });
  }

  validate(payload: { destination: string }) {
    const user = this.authService.validateUser(payload.destination);

    return user;
  }
}
