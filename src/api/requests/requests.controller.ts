import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { UserRole } from '../users/entities/user.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RequestsService } from './requests.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('requests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) { }

  @Get()
  async findAll(@Req() req) {
    return this.requestsService.findAll(req.user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    return this.requestsService.findOne(id, req.user);
  }

  @Post()
  async create(@Body() dto: CreateRequestDto, @Req() req) {
    return this.requestsService.create(dto, req.user);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateRequestDto, @Req() req) {
    return this.requestsService.update(id, dto, req.user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    return this.requestsService.remove(id, req.user);
  }

  @Get('to-approve')
  @Roles (UserRole.Manager)
  @UseGuards(RolesGuard)
  async findToApprove() {
    return this.requestsService.findToApprove();
  }

  @Put(':id/approve')
  @Roles(UserRole.Manager)
  @UseGuards(RolesGuard)
  async approve(@Param('id') id: string, @Req() req) {
    return this.requestsService.approve(id, req.user);
  }

  @Put(':id/refuse')
  @Roles(UserRole.Manager)
  @UseGuards(RolesGuard)
  async refuse(@Param('id') id: string, @Req() req) {
    return this.requestsService.refuse(id, req.user);
  }

  @Get('stats')
  @Roles(UserRole.Manager)
  @UseGuards(RolesGuard)
  async stats(
    @Query('month') month: number,
    @Query('year') year: number,
    @Query('employeeId') employeeId?: string,
  ) {
    return this.requestsService.getAggregatedStats(month, year, employeeId);
  }
}

