import {
  BelongsToMany,
  Column,
  CreatedAt,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Fixtures } from '..';
import { UsersAttributes } from './users.types';

@Table
export default class Users extends Model<UsersAttributes> {
  @Column
  email!: string;

  @Column
  role!: 'client' | 'admin' | 'developer';

  @Column
  name!: string;

  @Column
  lastname!: string;

  @Column
  phone?: string;

  @Column
  password!: string;

  @Column
  country?: string;

  @Column
  birthdate?: string;

  /* Un usuario tiene uno o muchos fixtures */
  @HasMany(() => Fixtures)
  fixtures?: Fixtures[];

  @CreatedAt
  @Column
  createdAt?: Date;

  @UpdatedAt
  @Column
  updatedAt?: Date;
}
