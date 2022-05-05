import {
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import Users from '../users/Users';
import { PaymentsCardsAttributes } from './paymentsCards.types';

@Table
export default class PaymentsCards extends Model<PaymentsCardsAttributes> {
  @ForeignKey(() => Users)
  @Column
  customer_id!: string;

  @BelongsTo(() => Users, 'user_id')
  user?: Users;

  @CreatedAt
  @Column
  createdAt?: Date;

  @UpdatedAt
  @Column
  updatedAt?: Date;
}
