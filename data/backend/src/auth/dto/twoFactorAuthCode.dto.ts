import { IsNotEmpty, IsString, Length } from 'class-validator';

export class TwoFactorAuthCodeDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  twoFactorAuthCode: string;
}
