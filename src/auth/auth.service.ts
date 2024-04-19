import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { SignupDto } from './dtos/signup.dto';

@Injectable()
export class AuthService {
  
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  validateUser(email: string) {
    const user = this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async generateToken(user: User) {
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

    return { accessToken, refreshToken };
  }

 async signup(user: SignupDto) {
    const exists = await this.userService.findByEmail(user.email);
    
    if(!exists) {
      return await this.userService.signupUser(user);
    }

    throw new HttpException('Email already in use', HttpStatus.FORBIDDEN );
  }
}
