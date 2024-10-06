import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtGuard } from './guards/jwt.guard';
import { AdminInterceptor } from './intercepters/admin.interceptor';
import { DevInterceptor } from './intercepters/dev.interceptor';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtGuard, JwtStrategy, AdminInterceptor, DevInterceptor],
  exports: [UsersService, JwtGuard, JwtStrategy, AdminInterceptor, DevInterceptor]
})
export class UsersModule {}
