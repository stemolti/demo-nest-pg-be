import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './api/users/entities/user.entity';
import { CategoryPermissions } from './api/categories/entities/category.entity';
import { RequestPermission } from './api/requests/entities/request.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "0.0.0.0",
      port: 5432,
      username: "postgres",
      password: "a",
      database: "postgres",
      entities: [User, CategoryPermissions, RequestPermission],
      synchronize: true,

      retryAttempts: 5,
      retryDelay: 3000,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}