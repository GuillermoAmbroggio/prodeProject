import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Pronostics, Users } from '..';
import { FixtureAttributes, PaymentStatus } from './fixtures.types';
import FixturesPrototypes from './FixturesPrototypes';

@Table
export default class Fixtures extends Model<FixtureAttributes> {
  @ForeignKey(() => FixturesPrototypes)
  @Column
  fixture_id!: number;

  @Column
  payment_status?: PaymentStatus;

  @Column
  payment_id?: string;

  @Column
  results_points?: number;

  /* Un fixture pertenece a un FixtrePrototype*/
  @BelongsTo(() => FixturesPrototypes, 'fixture_id')
  fixture_detail?: FixturesPrototypes;

  @ForeignKey(() => Users)
  @Column
  user_id!: number;

  /* Un fixtuure puede tener muchos pronosticos */
  @HasMany(() => Pronostics)
  pronostics?: Pronostics[];

  /* Un fixture puede pertenecer a un usuario*/
  @BelongsTo(() => Users, 'user_id')
  user?: Users;

  @CreatedAt
  @Column
  createdAt?: Date;

  @UpdatedAt
  @Column
  updatedAt?: Date;
}
