import { Module } from '@nestjs/common';
import { MatchingController } from './matching.controller';
@Module({ controllers: [MatchingController] })
export class MatchingModule {}
