import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtGuard } from './shared/guards/jwt-guard';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtGuard)
  @Get('protected')
  getProtected(@Req() req): string {
    // return req.user;
    return 'Hello World from protected!';
  }
}
