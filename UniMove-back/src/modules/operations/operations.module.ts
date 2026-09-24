import { Module } from '@nestjs/common';
import { AdminController, HistoryController, IncidentsController } from './operations.controller';
import { NotificationsModule } from '../notifications/notifications.module';
@Module({
  imports: [NotificationsModule],
  controllers: [IncidentsController, HistoryController, AdminController],
})
export class OperationsModule {}
