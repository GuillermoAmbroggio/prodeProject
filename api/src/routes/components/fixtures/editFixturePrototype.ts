import { Router, Request } from 'express';
import { FixturesPrototypes, MatchesPrototypes } from '../../../models';

const editFixturePrototype = Router();

type ReqBodyAddFixture = {
  name?: string;
  start_date?: Date;
};

editFixturePrototype.put(
  '/:id',
  /*isAdmin,*/
  async (req: Request<{ id: string }, {}, ReqBodyAddFixture>, res, next) => {
    try {
      const { name, start_date } = req.body;
      const fixtureId = req.params.id;
      const fixture = await FixturesPrototypes.findByPk(fixtureId);

      if (fixture) {
        fixture.update({ name, start_date });
        res.send(fixture);
      } else {
        res.status(404).send('No se encontro un fixture con ese id');
      }
    } catch (e: any) {
      res.status(404).send(e.message);
    }
  }
);

export default editFixturePrototype;
