import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { Request } from '@nestjs/common';

@Injectable()
export class RefreshTokenInterceptor implements NestInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger = new Logger('RefreshTokenInterceptor Logger');

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    this.logger.debug('Intercepting request');
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse();
      
    const userId = request.user.id;
    const email = request.user.email;

    const isRefreshTokenExpired =
      await this.authService.isRefreshTokenExpired(userId);

    if (isRefreshTokenExpired) {
      this.logger.debug(
        `Regenerating refresh token in interceptor for user id: ${userId}`,
      );
      const newRefreshToken = await this.authService.regenerateRefreshToken({
        id: userId,
        email,
      });

      response.setHeader(
        'Set-Cookie',
        `magic-link-refreshToken=${newRefreshToken}; HttpOnly; Path=/; Secure; Max-Age=${this.configService.get('REFRESH_TOKEN_EXPIRATION')}`,
      );
    }

    return next.handle();
  }
}
