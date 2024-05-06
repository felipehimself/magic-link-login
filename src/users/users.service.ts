import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignupDto } from 'src/auth/dtos/signup.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return await this.prisma.users.findFirst({
      where: { email },
      include: { account_confirmed: true },
    });
  }

  async findByUsername(username: string) {
    return await this.prisma.users.findFirst({
      where: { username },
    });
  }

  async createUser(user: SignupDto, codeConfirmation: string) {
    return await this.prisma.users.create({
      data: {
        ...user,
        account_confirmed: {
          create: {
            code_confirmation: codeConfirmation,
          },
        },
        user_session: {
          create: {
            refresh_token: null,
          },
        },
      },
    });
  }

  async deleteUser(id: string) {
    return await this.prisma.users.delete({ where: { id } });
  }

  async findById(id: string) {
    return await this.prisma.users.findFirst({
      where: { id },
      include: { account_confirmed: true },
    });
  }

  async confirmAccount(id: string) {
    // return await this.prisma.confirmAccount.update({
    //   where: { userId: id },
    //   data: {
    //     confirmed: true,
    //   },
    // });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, user] = await this.prisma.$transaction([
      this.prisma.confirmAccount.update({
        where: { userId: id },
        data: {
          confirmed: true,
        },
      }),
      this.prisma.users.findFirst({ where: { id } }),
    ]);

    return user;
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.prisma.users.findFirstOrThrow({
      where: { id: userId },
      include: {
        user_session: true,
      },
    });

    const refreshMatches = await bcrypt.compare(
      refreshToken,
      user.user_session.refresh_token ?? '',
    );

    if (refreshMatches) {
      return user;
    }
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
    refreshTokenExpiration: number,
  ) {
    const salts = await bcrypt.genSalt(10);
    const refreshHashed = await bcrypt.hash(refreshToken, salts);

    await this.prisma.userSession.update({
      where: {
        userId: userId,
      },
      data: {
        refresh_token: refreshHashed,
        refresh_token_expiration: new Date(refreshTokenExpiration),
      },
    });
  }

  async isRefreshTokenExpired(userId: string) {
    const { refresh_token_expiration } =
      await this.prisma.userSession.findFirst({
        where: {
          userId,
        },
      });

    const now = new Date();

    return new Date(refresh_token_expiration) < now;
  }
}
