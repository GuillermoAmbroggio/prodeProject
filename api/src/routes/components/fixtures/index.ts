import { Router } from 'express';
import addFixturePrototype from './addFixturePrototype';
import buyFixturePrototype from './buyFixture';
import calculateResults from './calculateResults';
import deleteFixturePrototype from './deleteFixturePrototype';
import editFixturePrototype from './editFixturePrototype';
import getFixturePrototype from './getFixturesPrototype';
import getResults from './getResults';

const fixtures = Router();

fixtures.use('', addFixturePrototype);
fixtures.use('', getFixturePrototype);
fixtures.use('', editFixturePrototype);
fixtures.use('', deleteFixturePrototype);
fixtures.use('', buyFixturePrototype);
fixtures.use('/calculate', calculateResults);
fixtures.use('/results', getResults);

export default fixtures;
