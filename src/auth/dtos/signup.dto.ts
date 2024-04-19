import { Transform } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @Length(1, 20)
  name: string;

  @IsString()
  @Transform(({ value }) => {
    return value.replace(/\s/g, '').trim();
  })
  @Length(1, 12)
  username: string;
}
