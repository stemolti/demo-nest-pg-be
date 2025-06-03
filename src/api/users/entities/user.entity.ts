import { RequestPermission } from "src/api/requests/entities/request.entity";
import { BaseEntity } from "src/common/base.entity";
import { Column, Entity, OneToMany } from "typeorm";

export enum UserRole {
  Employee = 'employee',
  Manager = 'manager',
}

@Entity('users')
export class User extends BaseEntity {
  @Column({ length: 100 })
  firstname: string;

  @Column({ length: 100 })
  lastname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.Employee })
  role: UserRole;

  @OneToMany(() => RequestPermission, (request) => request.user)
  requests: RequestPermission[];

  @OneToMany(() => RequestPermission, (request) => request.userValidation)
  validatedRequests: RequestPermission[];
}