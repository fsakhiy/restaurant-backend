import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import { PasswordService } from 'src/password.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, PasswordService],
})
export class AuthModule {}