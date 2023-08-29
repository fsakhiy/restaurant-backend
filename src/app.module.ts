import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FoodModule } from './food/food.module';
import { BeverageModule } from './beverage/beverage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    AuthModule,
    UserModule,
    FoodModule,
    BeverageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
