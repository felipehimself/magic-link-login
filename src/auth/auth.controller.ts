import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { JwtGuard } from 'src/shared/guards/jwt-guard';
import { AuthService } from './auth.service';
import { LoginDTO } from './dtos/login.dto';
import { SignupDto } from './dtos/signup.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { MagicLoginStrategy } from './strategies/magic-login.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly strategy: MagicLoginStrategy,
    private readonly configService: ConfigService,
  ) {}

  JWT_MAX_AGE = this.configService.get('JWT_MAX_AGE');
  REFRESH_TOKEN_MAX_AGE = this.configService.get('REFRESH_TOKEN_MAX_AGE');

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
    const { accessToken, refreshToken } = await this.authService.generateTokens(
      req.user,
    );

    res.setHeader('Set-Cookie', [
      `magic-link-accessToken=${accessToken}; HttpOnly; Path=/; Secure; Max-Age=${this.JWT_MAX_AGE}`,
      `magic-link-refreshToken=${refreshToken}; HttpOnly; Path=/; Secure; Max-Age=${this.REFRESH_TOKEN_MAX_AGE}`,
    ]);

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

  @HttpCode(200)
  @UseGuards(JwtGuard)
  @Post('is-signed-in')
  async isSignedIn(@Req() req) {
    return !!req.user;
  }

  @HttpCode(200)
  @Post('signout')
  async logout(@Req() req: Request, @Res() res: Response) {
    res.setHeader('Set-Cookie', [
      'magic-link-accessToken=; HttpOnly; Path=/; Secure; Max-Age=0',
      'magic-link-refreshToken=; HttpOnly; Path=/; Secure; Max-Age=0',
    ]);

    res.json({
      success: true,
      message: 'Signed out',
    });
  }

  @HttpCode(200)
  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  async refreshToken(@Req() req, @Res() res) {
    const accessToken = this.authService.generateAccessToken(
      req?.user?.email,
      req?.user?.id,
    );

    res.setHeader(
      'Set-Cookie',
      `magic-link-accessToken=${accessToken}; HttpOnly; Path=/; Secure; Max-Age=${this.JWT_MAX_AGE}`,
    );

    res.json({
      success: true,
      message: 'Updated',
    });
  }

}
