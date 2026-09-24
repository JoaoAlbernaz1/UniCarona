import { Module } from '@nestjs/common';
import { LocationsController, RouteTemplatesController } from './route-templates.controller';
@Module({ controllers: [RouteTemplatesController, LocationsController] })
export class RouteTemplatesModule {}
