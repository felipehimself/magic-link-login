import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError } from 'jsonwebtoken';

@Injectable()
export class JwtGuard extends AuthGuard('jwt-strategy') {
  handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status: any,
  ) {
    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException('Token provided is invalid');
    }

    if (info instanceof Error) {
      throw new UnauthorizedException('Invalid token');
    }

    return super.handleRequest(err, user, info, context, status);
  }
}
