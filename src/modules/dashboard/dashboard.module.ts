import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dashboard } from './entities/dashboard.entity';
import { AuthModule } from 'src/modules/auth/auth.module';
import { DashboardsController } from './dashboard.controller';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Dashboard]),
  ],
  controllers: [DashboardsController],
  providers: [DashboardService]
})
export class DashboardModule { }