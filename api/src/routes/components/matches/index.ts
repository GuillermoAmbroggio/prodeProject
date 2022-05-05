import { Router } from 'express';
import addMatchPrototype from './addMatchPrototype';
import editMatchPrototype from './editMatchPrototype';

const matches = Router();

matches.use('', addMatchPrototype);
matches.use('', editMatchPrototype);

export default matches;
