import { Module } from '@nestjs/common';
import { ReservationsController, RidesController } from './rides.controller';
import { NotificationsModule } from '../notifications/notifications.module';
@Module({ imports: [NotificationsModule], controllers: [RidesController, ReservationsController] })
export class RidesModule {}
