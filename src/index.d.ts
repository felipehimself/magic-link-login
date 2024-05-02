import { Request as ExpressRequest } from 'express';
import { UserOnRequest } from './auth/interfaces/user-on-request';
declare module '@nestjs/common' {
  interface Request extends ExpressRequest {
    user?: UserOnRequest;
  }
}
