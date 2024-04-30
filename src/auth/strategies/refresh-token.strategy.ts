import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { IPayload } from '../interfaces/payload.interface';
// import { UserService } from 'src/user/user.service';
// import { IPayload } from '../interfaces';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-token-strategy',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.['magic-link-refreshToken'];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: IPayload) {
    const refreshToken = request.cookies?.['magic-link-refreshToken'];

    const userId = payload.sub;

    return await this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      userId,
    );
  }
}
