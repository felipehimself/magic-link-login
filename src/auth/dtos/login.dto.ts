import { IsEmail } from 'class-validator';
export class LoginDTO {
  @IsEmail()
  destination: string;
}
