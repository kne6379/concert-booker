import Joi from 'joi';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { ShowModule } from './show/show.module';
import { Show } from './show/entities/show.entity';
import { Category } from './show/entities/category.entity';
import { Showdate } from './show/entities/showdate.entity';
import { CategoryModule } from './category/category.module';
import { TicketsModule } from './ticket/tickets.module';
import { SeatsModule } from './seat/seats.module';
import { SalesSeat } from './seat/entities/sales-seat.entity';
import { PurchaseHistory } from './ticket/entities/purchase-history.entity';
import { SeatGrade } from './seat/entities/seat-grade.entity';
import { Ticket } from './ticket/entities/ticket.entity';
// import { RedisModule } from '@liaoliaots/nestjs-redis';

const typeOrmModuleOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    database: configService.get('DB_NAME'),
    entities: [
      User,
      Show,
      Category,
      Showdate,
      SalesSeat,
      PurchaseHistory,
      SeatGrade,
      Ticket,
    ],
    synchronize: configService.get('DB_SYNC'),
    logging: true,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET_KEY: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_PASSWORD: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    // RedisModule.forRootAsync({
    //   useFactory: async (configService: ConfigService) => ({
    //     readyLog: true,
    //     config: {
    //       host: configService.get('REDIS_HOST'),
    //       port: configService.get('REDIS_PORT'),
    //       password: configService.get('REDIS_PASSWORD'),
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),
    AuthModule,
    UserModule,
    ShowModule,
    CategoryModule,
    TicketsModule,
    SeatsModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
