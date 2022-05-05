import { Router } from 'express';

import { users, cookieAuth, home, tokenAuth, googleAuth } from './components';
import fixtures from './components/fixtures';
import matches from './components/matches';
import payments from './components/mercadoPago';
import pruebas from './components/pruebas/pruebas';

const router = Router();

//Este eliminar:
router.use('/', pruebas);

router.use('/', cookieAuth);
router.use('/', tokenAuth);
router.use('/', googleAuth);
router.use('/home', home);
router.use('/users', users);
router.use('/payments', payments);
router.use('/fixtures', fixtures);

router.use('/matches', matches);

export default router;
