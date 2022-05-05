import {
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Fixtures } from '..';
import MatchesPrototypes from '../matches/MatchesPrototypes';
import { PronosticsAttributes } from './pronostics.types';

@Table
export default class Pronostics extends Model<PronosticsAttributes> {
  @Column
  pronostic_one?: number;

  @Column
  pronostic_two?: number;

  @Column
  results_points?: string;

  @ForeignKey(() => MatchesPrototypes)
  @Column
  match_id!: number;

  /* Un pronostico  pertene a un partido */
  @BelongsTo(() => MatchesPrototypes, 'match_id')
  match?: MatchesPrototypes;

  @ForeignKey(() => Fixtures)
  @Column
  fixture_id!: number;

  /* Un pronostico  pertene a un fixture */
  @BelongsTo(() => Fixtures, 'fixture_id')
  fixture?: Fixtures;

  @CreatedAt
  @Column
  createdAt?: Date;

  @UpdatedAt
  @Column
  updatedAt?: Date;
}
