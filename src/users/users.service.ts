import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignupDto } from 'src/auth/dtos/signup.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return await this.prisma.user.findFirst({
      where: { email },
      include: { account_confirmed: true },
    });
  }

  async createUser(user: SignupDto, codeConfirmation: string) {
    return await this.prisma.user.create({
      data: {
        ...user,
        account_confirmed: {
          create: {
            code_confirmation: codeConfirmation,
          },
        },
        user_session: {
          create: {
            refresh_token: '',
          },
        },
      },
    });
  }

  async deleteUser(id: string) {
    return await this.prisma.user.delete({ where: { id } });
  }

  async findById(id: string) {
    return await this.prisma.user.findFirst({
      where: { id },
      include: { account_confirmed: true },
    });
  }

  async confirmAccount(id: string) {
    return await this.prisma.confirmAccount.update({
      where: { userId: id },
      data: {
        confirmed: true,
      },
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
      include: {
        user_session: true,
      }
    });

    const refreshMatches = await bcrypt.compare(
      refreshToken,
      user.user_session.refresh_token
    );


    if (refreshMatches) {
      return user;
    }
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const salts = await bcrypt.genSalt(10);
    const refreshHashed = await bcrypt.hash(refreshToken, salts);

    await this.prisma.userSession.update({
      where: {
        userId: userId,
      },
      data: {
        refresh_token: refreshHashed,
      },
    });
  }
}
