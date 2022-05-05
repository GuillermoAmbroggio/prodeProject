import {
  BelongsToMany,
  Column,
  CreatedAt,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { MatchesPrototypes } from '..';
import Fixtures from './Fixtures';
import { FixturePrototypeAttributes } from './fixtures.types';

@Table
export default class FixturesPrototypes extends Model<FixturePrototypeAttributes> {
  @Column
  name!: string;

  @Column
  start_date!: Date;

  @Column
  total_raised?: number;

  @Column
  total_participants?: number;

  @Column
  price?: number;

  @Column
  preference_id?: string;

  /* Un fixture puede tener muchos partidos */
  @HasMany(() => MatchesPrototypes)
  matches?: MatchesPrototypes[];

  /* Un fixture puede tener muchos fixtures de usuarios */
  @HasMany(() => Fixtures)
  fixtures?: Fixtures[];

  @CreatedAt
  @Column
  createdAt?: Date;

  @UpdatedAt
  @Column
  updatedAt?: Date;
}
