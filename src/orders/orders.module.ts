import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { RedisCacheModule } from '../redis/redis.module';
import { OrderService } from './services/order/order.service';
import { OrderController } from './controllers/order/order.controller';
import { UserService } from '../apigate/service/user.service';

@Module({
    imports: [HttpModule,
        TypeOrmModule.forFeature([]),
        AuthModule,
        RedisCacheModule,
      ],
      providers: [OrderService, UserService],
      controllers: [OrderController]
})
export class OrdersModule {}
