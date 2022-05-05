import { Router, Request } from 'express';
import { FixturesPrototypes, MatchesPrototypes } from '../../../models';

const deleteFixturePrototype = Router();

deleteFixturePrototype.delete(
  '/:id',
  /*isAdmin,*/
  async (req: Request<{ id: string }, {}, {}>, res, next) => {
    try {
      const fixtureId = req.params.id;
      const fixture = await FixturesPrototypes.findByPk(fixtureId, {
        include: [MatchesPrototypes],
      });

      if (fixture) {
        fixture.destroy();
        res.send(fixture);
      } else {
        res.status(404).send('No se encontro un fixture con ese id');
      }
    } catch (e: any) {
      res.status(404).send(e.message);
    }
  }
);

export default deleteFixturePrototype;
