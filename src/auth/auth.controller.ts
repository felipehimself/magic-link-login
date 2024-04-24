import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDTO } from './dtos/login.dto';
import { SignupDto } from './dtos/signup.dto';
import { MagicLoginStrategy } from './strategies/magic-login.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly strategy: MagicLoginStrategy,
  ) {}

  @Post('login')
  login(
    @Req() req,
    @Res() res: Response,
    @Body(new ValidationPipe()) { destination }: LoginDTO,
  ) {
    this.authService.validateUser(destination);
    return this.strategy.send(req, res);
  }

  @UseGuards(AuthGuard('magic-link-strategy'))
  @Get('login/callback')
  async callback(@Req() req, @Res() res: Response) {
    const { accessToken } = await this.authService.generateToken(req.user);

    // TODO: Enviar tbm refresh para posterior tratamento...
    res.setHeader(
      'Set-Cookie',
      `magic-link-accessToken=${accessToken}; HttpOnly; Path=/; Secure; Max-Age=3600000`,
    );

    res.json({
      success: true,
      message: 'Successfully logged in!',
    });
  }

  @Post('sign-up')
  async signup(@Body() body: SignupDto, @Res() res: Response) {
    await this.authService.signup(body);

    return res.json({ success: true, message: 'Email sent!' });
  }

  @Get('confirm-account')
  async confirmAccount(
    @Query('userId') userId: string,
    @Query('codeConfirmation') codeConfirmation: string,
  ) {
    await this.authService.confirmAccount(userId, codeConfirmation);

    return true;
  }
}
