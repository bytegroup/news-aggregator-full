import { LoggedUserDto } from '../dto/logged-user.dto';

export interface LoginStatus {
  accessToken: string;
  refreshToken: string;
  user: LoggedUserDto;
}
