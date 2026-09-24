import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { IsBoolean, IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';
import { CurrentUser } from '../../common/decorators/auth.decorators';
import type { AuthUser } from '../../common/decorators/auth.decorators';
import { PrismaService } from '../../database/prisma.service';
import { RoleName } from '../../generated/prisma/enums';

class CreateVehicleDto {
  @IsString() brand!: string;
  @IsString() model!: string;
  @IsString() color!: string;
  @IsString() @MinLength(7) plate!: string;
  @IsInt() @Min(1950) @Max(2100) year!: number;
  @IsInt() @Min(1) @Max(8) passengerCapacity!: number;
}
class UpdateVehicleDto {
  @IsOptional() @IsString() color?: string;
  @IsOptional() @IsBoolean() active?: boolean;
  @IsOptional() @IsInt() @Min(1) @Max(8) passengerCapacity?: number;
}

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly prisma: PrismaService) {}
  @Post() async create(@CurrentUser() user: AuthUser, @Body() dto: CreateVehicleDto) {
    const plate = dto.plate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const existing = await this.prisma.vehicle.findUnique({ where: { plate } });
    if (existing) throw new ConflictException('Placa já cadastrada.');
    return this.prisma.$transaction(async (tx) => {
      const vehicle = await tx.vehicle.create({ data: { ...dto, plate, ownerId: user.id } });
      const role = await tx.role.upsert({
        where: { name: RoleName.DRIVER },
        update: {},
        create: { name: RoleName.DRIVER },
      });
      await tx.userRole.upsert({
        where: { userId_roleId: { userId: user.id, roleId: role.id } },
        update: {},
        create: { userId: user.id, roleId: role.id },
      });
      return vehicle;
    });
  }
  @Get() list(@CurrentUser() user: AuthUser) {
    return this.prisma.vehicle.findMany({
      where: { ownerId: user.id, active: true },
      orderBy: { createdAt: 'desc' },
    });
  }
  @Get(':id') async get(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.owned(user.id, id);
  }
  @Patch(':id') async update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateVehicleDto,
  ) {
    await this.owned(user.id, id);
    return this.prisma.vehicle.update({ where: { id }, data: dto });
  }
  @Delete(':id') @HttpCode(204) async remove(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ) {
    await this.owned(user.id, id);
    await this.prisma.vehicle.update({ where: { id }, data: { active: false } });
  }
  private async owned(ownerId: string, id: string) {
    const item = await this.prisma.vehicle.findFirst({ where: { id, ownerId } });
    if (!item) throw new NotFoundException('Veículo não encontrado.');
    return item;
  }
}
