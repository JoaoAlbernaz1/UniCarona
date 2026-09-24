import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { CurrentUser } from '../../common/decorators/auth.decorators';
import type { AuthUser } from '../../common/decorators/auth.decorators';
import { PrismaService } from '../../database/prisma.service';
import { ReservationStatus, RideStatus } from '../../generated/prisma/enums';

class RatingDto {
  @IsUUID() rideId!: string;
  @IsUUID() reviewedUserId!: string;
  @IsInt() @Min(1) @Max(5) score!: number;
  @IsOptional() @IsString() comment?: string;
}
@Controller('ratings')
export class RatingsController {
  constructor(private readonly prisma: PrismaService) {}
  @Post() async create(@CurrentUser() user: AuthUser, @Body() dto: RatingDto) {
    if (user.id === dto.reviewedUserId)
      throw new ConflictException('Não é permitido avaliar a si mesmo.');
    const ride = await this.prisma.ride.findUnique({
      where: { id: dto.rideId },
      include: { reservations: { where: { status: ReservationStatus.COMPLETED } } },
    });
    if (!ride || ride.status !== RideStatus.COMPLETED)
      throw new ConflictException('A carona ainda não foi concluída.');
    const participants = new Set([ride.driverId, ...ride.reservations.map((r) => r.passengerId)]);
    if (!participants.has(user.id) || !participants.has(dto.reviewedUserId))
      throw new ConflictException('Apenas participantes podem se avaliar.');
    return this.prisma.rating.create({ data: { ...dto, reviewerId: user.id } });
  }
}
