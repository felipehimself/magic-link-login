import { Injectable } from '@nestjs/common';
import { SignupDto } from 'src/auth/dtos/signup.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: 1,
      email: 'a@email.com',
      name: 'felipe',
      created_at: new Date(),
      updated_at: new Date(),
      username: 'felipe',
    },
  ];

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
      },
    });
  }

  async deleteUser(id: string) {
    return await this.prisma.user.delete({ where: { id } });
  }

  findOneByEmail(email: string) {
    return this.users.find((user) => user.email === email);
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
}
