import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({ usernameField: 'email' });
  }
  async validate(email: string, password: string) {
    const user = await this.userService.createToken({
      email: email,
      password: password,
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
