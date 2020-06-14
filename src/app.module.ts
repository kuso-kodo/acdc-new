import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AirModule } from './air/air.module';
import { CustomerController } from './customer.controller';
import { ReceptionistController } from './receptionist.controller';
import { MatainerController } from './matainer.controller';
import { ManagerController } from './manager.controller';

@Module({
  imports: [
    AuthModule,
    UserModule,
    AirModule,
    TypeOrmModule.forRoot({ autoLoadEntities: true }),
  ],
  controllers: [
    AppController,
    CustomerController,
    ReceptionistController,
    MatainerController,
    ManagerController,
  ],
  providers: [AppService],
})
export class AppModule {}
