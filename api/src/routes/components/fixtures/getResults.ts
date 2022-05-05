import { Router, Request } from 'express';
import {
  Fixtures,
  FixturesPrototypes,
  MatchesPrototypes,
  Pronostics,
  Users,
} from '../../../models';

const getResults = Router();

getResults.get(
  '/:id',
  /*isAuthenticate,*/
  async (req: Request<{ id: string }, {}, {}>, res, next) => {
    try {
      const fixtureId = req.params.id;
      const fixture = await FixturesPrototypes.findByPk(fixtureId, {
        attributes: ['id', 'name'],

        include: [
          {
            model: Fixtures,
            include: [
              {
                model: Users,
                attributes: ['id', 'name', 'lastname'],
              },
            ],
            order: [['results_points', 'DESC']],
            attributes: ['id', 'fixture_id', 'results_points'],
          },
        ],
      });

      if (fixture) {
        if (fixture.fixtures?.length) {
          if (fixture.matches && fixture.matches?.length) {
            return res.send(fixture);
          } else {
            return res
              .status(404)
              .send('El fixture no tiene partidos cargados');
          }
        } else {
          return res
            .status(404)
            .send('No hay ningun fixture cargado por un usuario');
        }
      } else {
        return res.status(404).send('No se encontro un fixture con ese id');
      }
    } catch (e: any) {
      return res.status(404).send(e.message);
    }
  }
);

export default getResults;
