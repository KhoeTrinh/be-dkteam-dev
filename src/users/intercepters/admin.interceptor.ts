import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../users.service';

@Injectable()
export class AdminInterceptor implements NestInterceptor {
  constructor(private userService: UsersService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest()
    const res = this.userService.check(req)
    if(res.user.isAdmin === false) throw new HttpException('Users and Devs are not allowed to access', 403)
    return next.handle();
  }
}
