import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { nanoid } from 'nanoid';
import { CronService } from 'src/cron/cron.service';
import { EmailService } from 'src/email/email.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { SignupDto } from './dtos/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly cronService: CronService,
  ) {}

  async validateUser(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRATION'),
        issuer: this.configService.get('JWT_ISSUER'),
        audience: this.configService.get('JWT_AUDIENCE'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION'),
        issuer: this.configService.get('REFRESH_TOKEN_ISSUER'),
        audience: this.configService.get('REFRESH_TOKEN_AUDIENCE'),
      }),
    ]);

    await this.userService.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async signup(user: SignupDto) {
    const exists = await this.userService.findByEmail(user.email);

    if (exists) {
      // TODO: se não tiver confirmado, enviar email de confirmação
      throw new HttpException('Email already in use', HttpStatus.FORBIDDEN);
    }

    const codeConfirmation = nanoid(10);
    const newUser = await this.userService.createUser(user, codeConfirmation);

    await this.emailService.sendEmailConfirmation(
      newUser.email,
      newUser.id,
      codeConfirmation,
    );

    this.cronService.jobToDeleteNotConfirmedAccount(newUser.id);
  }

  async confirmAccount(userId: string, codeConfirmation: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.FORBIDDEN);
    }

    if (user.account_confirmed.code_confirmation !== codeConfirmation) {
      throw new HttpException('Invalid credentials', HttpStatus.FORBIDDEN);
    }

    if (user.account_confirmed.confirmed) {
      // TODO:
      // Tratar erro no front... se retornar esse status, redirecionar p/ login msm assim
      throw new HttpException(
        'Account already confirmed',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    return await this.userService.confirmAccount(userId);
  }

  generateAccessToken(email: string, id: string) {
    const payload = { sub: id, email: email };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRATION'),
      issuer: this.configService.get('JWT_ISSUER'),
      audience: this.configService.get('JWT_AUDIENCE'),
    });

    return accessToken;
  }
}
