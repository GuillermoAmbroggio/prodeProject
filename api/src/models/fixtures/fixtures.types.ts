export type PaymentStatus = 'approved' | 'pending' | 'failure';

export interface FixtureAttributes {
  id?: number;
  fixtre_id: number;
  user_id: number;
  payment_status?: PaymentStatus;
  payment_id?: string;
  results_points?: number;
}

export interface FixturePrototypeAttributes {
  id?: number;
  total_raised?: number;
  total_participants?: number;
  name: string;
  price?: string;
  start_date: Date;
  preference_id?: string;
}
