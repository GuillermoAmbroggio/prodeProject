import { Router } from 'express';
import addPayment from './addPayment';
import createPreference from './createPreference';
import deletePayment from './deletePayment';
import getPayment from './getPayments';

const payments = Router();

payments.use('/cards', addPayment);
payments.use('', getPayment);
payments.use('/cards', deletePayment);
payments.use('/', createPreference);

export default payments;
