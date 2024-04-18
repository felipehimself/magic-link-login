import { Injectable } from '@nestjs/common';
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
    },
  ];

   findOneByEmail(email: string) {
    return this.users.find((user) => user.email === email);
  }
}
