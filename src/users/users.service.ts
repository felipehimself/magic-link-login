import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './entities/user.entity';
import { SignupDto } from 'src/auth/dtos/signup.dto';

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

  async findByEmail(email:string) {
    return await this.prisma.user.findFirst({ where: { email } });
  }

  async signupUser(user:SignupDto) {
    return await this.prisma.user.create({ data: user });
  }

  findOneByEmail(email: string) {
    return this.users.find((user) => user.email === email);
  }
}
