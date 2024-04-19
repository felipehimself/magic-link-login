import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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
    @Res() res,
    @Body(new ValidationPipe()) { destination }: LoginDTO,
  ) {
    this.authService.validateUser(destination);
    return this.strategy.send(req, res);
  }

  @UseGuards(AuthGuard('magic-link-strategy'))
  @Get('login/callback')
  async callback(@Req() req, @Res() res) {
    const { accessToken } = await this.authService.generateToken(req.user);

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
  async signup(@Body() body: SignupDto) {
    const user = await this.authService.signup(body);
    
    return user;
  }
}
