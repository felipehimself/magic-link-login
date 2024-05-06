import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { nanoid } from 'nanoid';
import { CronService } from 'src/cron/cron.service';
import { EmailService } from 'src/email/email.service';
import { ISendMagicLink } from 'src/shared/interfaces/send-magic-link.interface';
import { UsersService } from 'src/users/users.service';
import { SignupDto } from './dtos/signup.dto';
import { IGenerateToken } from './interfaces/generate-token.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly cronService: CronService,
  ) {}

  private readonly logger = new Logger('Auth Service Logger');

  async validateUser(email: string) {
    this.logger.debug(`Validating user ${email} to sign in`);
    const user = await this.userService.findByEmail(email);
    if (!user) {
      this.logger.error(`User ${email} not found`);
      throw new NotFoundException('User not found');
    }

    if (!user.account_confirmed.confirmed) {
      this.logger.error(`Account not confirmed for user ${email}`);
      throw new HttpException('Account not confirmed', HttpStatus.FORBIDDEN);
    }

    return user;
  }

  async generateTokens({ id, email }: IGenerateToken) {
    this.logger.debug(`Generating tokens for user ${email}`);

    const payload = { sub: id, email: email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: +this.configService.get('JWT_EXPIRATION'),
        issuer: this.configService.get('TOKEN_ISSUER'),
        audience: this.configService.get('TOKEN_AUDIENCE'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: +this.configService.get('REFRESH_TOKEN_EXPIRATION'),
        issuer: this.configService.get('TOKEN_ISSUER'),
        audience: this.configService.get('TOKEN_AUDIENCE'),
      }),
    ]);

    const expirationDate = this.generateRefreshTokenExpirationDate();

    this.logger.debug(`Generating tokens for user ${email}`);
    await this.userService.updateRefreshToken(id, refreshToken, expirationDate);

    return { accessToken, refreshToken };
  }

  async signup(user: SignupDto) {
    this.logger.debug(`Signing up user ${user.email}`);
    const emailInUse = await this.userService.findByEmail(user.email);

    if (emailInUse) {
      this.logger.error(`Email already in use: ${user.email}`);

      throw new HttpException('Email already in use', HttpStatus.FORBIDDEN);
    }

    const usernameInUse = await this.userService.findByUsername(user.username);

    if (usernameInUse) {
      this.logger.error(`Username already in use: ${user.username}`);

      throw new HttpException('Username already in use', HttpStatus.FORBIDDEN);
    }

    const codeConfirmation = nanoid(10);
    const newUser = await this.userService.createUser(user, codeConfirmation);

    await this.emailService.sendEmailConfirmation({
      email: newUser.email,
      userId: newUser.id,
      codeConfirmation: codeConfirmation,
    });

    this.cronService.jobToDeleteNotConfirmedAccount(newUser.id);
  }

  async sendMagicLinkEmail({ email, url }: ISendMagicLink) {
    this.logger.debug(`Sending magic link to ${url}`);

    await this.emailService.sendMagicLinkEmail({ email, url });
  }

  async confirmAccount(userId: string, codeConfirmation: string) {
    this.logger.debug(`Confirming account for user id: ${userId}`);

    const user = await this.userService.findById(userId);

    if (
      !user ||
      user.account_confirmed.code_confirmation !== codeConfirmation
    ) {
      throw new HttpException('Invalid credentials', HttpStatus.FORBIDDEN);
    }

    if (user.account_confirmed.confirmed) return user;

    return await this.userService.confirmAccount(userId);
  }

  generateAccessToken(email: string, id: string) {
    this.logger.debug(`Generating access token for user ${email}`);
    const payload = { sub: id, email: email };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: +this.configService.get('JWT_EXPIRATION'),
      issuer: this.configService.get('TOKEN_ISSUER'),
      audience: this.configService.get('TOKEN_AUDIENCE'),
    });

    return accessToken;
  }

  async regenerateRefreshToken({ id, email }: IGenerateToken) {
    this.logger.debug(`Regenerating refresh token for user ${email}`);
    const payload = { sub: id, email: email };

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: +this.configService.get('REFRESH_TOKEN_EXPIRATION'),
      issuer: this.configService.get('TOKEN_ISSUER'),
      audience: this.configService.get('TOKEN_AUDIENCE'),
    });

    const expirationDate = this.generateRefreshTokenExpirationDate();

    await this.userService.updateRefreshToken(id, refreshToken, expirationDate);

    return refreshToken;
  }

  private generateRefreshTokenExpirationDate() {
    this.logger.debug(`Generating refresh token expiration date`);
    const expirationInSeconds = +this.configService.get(
      'REFRESH_TOKEN_EXPIRATION',
    );

    const toMilliseconds = 1000 * expirationInSeconds;

    const now = new Date();
    return now.getTime() + toMilliseconds;
  }

  async isRefreshTokenExpired(userId: string) {
    this.logger.debug(
      `Checking if refresh token is expired for user id: ${userId}`,
    );
    return await this.userService.isRefreshTokenExpired(userId);
  }
}
