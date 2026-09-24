import { Module } from '@nestjs/common';
import { DriverRequestsController, RideRequestsController } from './ride-requests.controller';
import { NotificationsModule } from '../notifications/notifications.module';
@Module({
  imports: [NotificationsModule],
  controllers: [DriverRequestsController, RideRequestsController],
})
export class RideRequestsModule {}
