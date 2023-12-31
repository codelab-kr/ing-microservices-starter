import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  id?: string;

  @IsOptional()
  password?: string;

  @IsOptional()
  username?: string;

  @IsOptional()
  isSubscribed?: boolean;
}
