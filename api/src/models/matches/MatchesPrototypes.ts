import {
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { FixturesPrototypes, Pronostics } from '..';
import { MatchesPrototypesAttributes } from './matches.types';

@Table
export default class MatchesPrototypes extends Model<MatchesPrototypesAttributes> {
  @Column
  team_one!: string;

  @Column
  team_two!: string;

  @Column
  result_one?: number;

  @Column
  result_two?: number;

  @Column
  date_match?: Date;

  @Column
  stadium?: string;

  @ForeignKey(() => FixturesPrototypes)
  @Column
  fixture_id!: number;

  /* Un partido  pertene a un fixture */
  @BelongsTo(() => FixturesPrototypes, 'fixture_id')
  fixture?: FixturesPrototypes;

  /* Un partido puede tener muchos pronosticos */
  @HasMany(() => Pronostics)
  pronostics?: Pronostics[];

  @CreatedAt
  @Column
  createdAt?: Date;

  @UpdatedAt
  @Column
  updatedAt?: Date;
}
