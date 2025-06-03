import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { User, UserRole } from '../users/entities/user.entity';
import { RequestPermission, RequestState } from './entities/request.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(RequestPermission)
    private readonly requestRepo: Repository<RequestPermission>,
  ) {}

  async findAll(user: User): Promise<RequestPermission[]> {
    if (user.role === UserRole.Manager) {
      return this.requestRepo.find({ relations: ['user', 'category', 'userValidation'] }); // tutti i permessi per il manager
    }
    return this.requestRepo.find({
      where: { user: { id: user.id } },
      relations: ['category'],
    }); // solo permessi personali
  }

  async findOne(id: string, user: User): Promise<RequestPermission> {
    const request = await this.requestRepo.findOne({
      where: { id },
      relations: ['user', 'category', 'userValidation'],
    });
    if (!request) throw new NotFoundException('Richiesta non trovata');
    if (user.role !== UserRole.Manager && request.user.id !== user.id) {
      throw new ForbiddenException('Accesso non autorizzato');
    }
    return request;
  }

  async create(createDto: CreateRequestDto, user: User): Promise<RequestPermission> {
    const newReq = this.requestRepo.create({
      ...createDto,
      user,
      dateRequest: new Date(),
    });
    return this.requestRepo.save(newReq);
  }

  async update(id: string, updateDto: UpdateRequestDto, user: User): Promise<RequestPermission> {
    const request = await this.findOne(id, user);
    if (request.state !== RequestState.Waiting || request.user.id !== user.id) {
      throw new ForbiddenException('Impossibile modificare');
    }
    Object.assign(request, updateDto);
    return this.requestRepo.save(request);
  }

  async remove(id: string, user: User): Promise<void> {
    const request = await this.findOne(id, user);
    if (request.state !== RequestState.Waiting || request.user.id !== user.id) {
      throw new ForbiddenException('Impossibile eliminare');
    }
    await this.requestRepo.delete(id);
  }

  async findToApprove(): Promise<RequestPermission[]> {
    return this.requestRepo.find({
      where: { state: RequestState.Waiting },
      relations: ['user', 'category'],
    });
  }

  async approve(id: string, manager: User): Promise<RequestPermission> {
    const request = await this.requestRepo.findOne({ where: { id }, relations: ['user', 'category'] });
    if (!request) throw new NotFoundException('Richiesta non trovata');
    if (manager.role !== UserRole.Manager) {
      throw new ForbiddenException('Solo responsabili possono approvare');
    }
    request.state = RequestState.Approved;
    request.userValidation = manager;
    request.dateValidation = new Date();
    return this.requestRepo.save(request);
  }

  async refuse(id: string, manager: User): Promise<RequestPermission> {
    const request = await this.requestRepo.findOne({ where: { id }, relations: ['user', 'category'] });
    if (!request) throw new NotFoundException('Richiesta non trovata');
    if (manager.role !== UserRole.Manager) {
      throw new ForbiddenException('Solo responsabili possono rifiutare');
    }
    request.state = RequestState.Refused;
    request.userValidation = manager;
    request.dateValidation = new Date();
    return this.requestRepo.save(request);
  }

  // Endpoint aggregato avanzato
  async getAggregatedStats(
    month: number,
    year: number,
    employeeId?: string,
  ): Promise<{ employee: User; totalDays: number }[]> {
    const qb = this.requestRepo.createQueryBuilder('request')
      .leftJoinAndSelect('request.user', 'user')
      .where('EXTRACT(MONTH FROM request.dateStart) = :month', { month })
      .andWhere('EXTRACT(YEAR FROM request.dateStart) = :year', { year })
      .andWhere('request.state = :state', { state: RequestState.Approved });
    if (employeeId) qb.andWhere('user.id = :employeeId', { employeeId });
    const results = await qb
      .select('user.id', 'userId')
      .addSelect('user.firstname', 'firstname')
      .addSelect('user.lastname', 'lastname')
      .addSelect(`SUM(DATE_PART('day', request.dateEnd - request.dateStart) + 1)`, 'totalDays')
      .groupBy('user.id')
      .addGroupBy('user.firstname')
      .addGroupBy('user.lastname')
      .getRawMany();

    // Mappatura a oggetto
    return results.map((row) => ({
      employee: { id: row.userId, firstname: row.firstname, lastname: row.lastname } as any,
      totalDays: parseInt(row.totaldays, 10),
    }));
  }
}