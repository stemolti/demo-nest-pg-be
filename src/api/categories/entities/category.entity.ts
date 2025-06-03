import { RequestPermission } from "src/api/requests/entities/request.entity";
import { BaseEntity } from "src/common/base.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity('categories')
export class CategoryPermissions extends BaseEntity {
  @Column({ length: 100 })
  description: string;

  @OneToMany(() => RequestPermission, (request) => request.category)
  requests: RequestPermission[];
}