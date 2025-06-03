import { CategoryPermissions } from "src/api/categories/entities/category.entity";
import { User } from "src/api/users/entities/user.entity";
import { BaseEntity } from "src/common/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";

export enum RequestState {
  Waiting = 'waiting',
  Approved = 'approved',
  Refused = 'refused',
}

@Entity('requests')
export class RequestPermission extends BaseEntity {
  @Column({ type: 'timestamp with time zone' })
  dateRequest: Date;

  @Column({ type: 'timestamp with time zone' })
  dateStart: Date;

  @Column({ type: 'timestamp with time zone' })
  dateEnd: Date;

  @ManyToOne(() => CategoryPermissions, (category) => category.requests)
  category: CategoryPermissions;

  @Column('text')
  motivation: string;

  @Column({ type: 'enum', enum: RequestState, default: RequestState.Waiting })
  state: RequestState;

  @ManyToOne(() => User, (user) => user.requests)
  user: User;

  @Column({ type: 'timestamp with time zone', nullable: true })
  dateValidation: Date;

  @ManyToOne(() => User, (user) => user.validatedRequests, { nullable: true })
  userValidation: User;
}