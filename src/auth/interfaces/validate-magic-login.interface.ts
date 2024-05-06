import { Prisma } from '@prisma/client';
export interface IValidateMagicLogin
  extends Prisma.UsersGetPayload<{
    include: {
      account_confirmed: true;
    };
  }> {}
