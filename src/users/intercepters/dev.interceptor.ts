import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../users.service';

@Injectable()
export class DevInterceptor implements NestInterceptor {
  constructor(private userService: UsersService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest()
    const res = this.userService.check(req)
    if(res.user.isDev === false) throw new HttpException('Users are not allowed to access', 403)
    return next.handle();
  }
}
