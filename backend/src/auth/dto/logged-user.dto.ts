import { Exclude, Expose } from 'class-transformer';
import { IsDefined } from 'class-validator';

@Exclude()
export class LoggedUserDto {
  @Expose()
  @IsDefined()
  name: string;

  @Expose()
  @IsDefined()
  email: string;
}
