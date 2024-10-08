import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../users.service';

@Injectable()
export class DevInterceptor implements NestInterceptor {
  constructor(private userService: UsersService) {}
  async intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest()
    const res = await this.userService.check(req)
    if(res.user.isDev === false) throw new HttpException('Users are not allowed to access', 403)
    return next.handle();
  }
}
