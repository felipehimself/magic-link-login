import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MagicLoginStrategy } from './strategies/magic-login.strategy';
import { EmailModule } from 'src/email/email.module';
import { CronModule } from 'src/cron/cron.module';

@Module({
  imports: [UsersModule, PassportModule, JwtModule.register({}), EmailModule, CronModule],
  controllers: [AuthController],
  providers: [AuthService, MagicLoginStrategy, JwtStrategy],
})
export class AuthModule {}
