import { Router, Request } from 'express';
import isAdmin from '../../../hooks/authentication/isAdmin';
import { validateEmptyField } from '../../../hooks/validations/useValidations';
import {
  Fixtures,
  FixturesPrototypes,
  MatchesPrototypes,
  Pronostics,
  Users,
} from '../../../models';

const buyFixturePrototype = Router();

type ReqBodyBuyFixture = {
  fixture_id: number;
  matches: {
    match_id: number;
    pronostic_one: number;
    pronostic_two: number;
  }[];
};

buyFixturePrototype.post(
  '/buy',
  /*isAuthenticate,*/
  async (req: Request<{}, {}, ReqBodyBuyFixture>, res, next) => {
    try {
      const { fixture_id, matches } = req.body;
      const idUser = 1; // req.session.user.id;
      const user = await Users.findByPk(idUser);
      if (user) {
        const objectNoNull = {
          fixture_id,
          matches,
        };
        /* Reviso los campos requeridos  */
        const errorResponse = validateEmptyField(objectNoNull);
        if (errorResponse) {
          return res.status(404).send(errorResponse);
        }

        /* Reviso en la BD si existe el fixture */
        const fixture = await FixturesPrototypes.findByPk(fixture_id, {
          include: [MatchesPrototypes],
        });

        if (fixture) {
          /* Si existe el prototype fixture entonces creo uno para el usuario */
          const fixtureBuy = await Fixtures.create();
          /* Agrego el fixture al usuario */
          user?.$add('fixtures', fixtureBuy);
          fixtureBuy.$set('user', user);
          fixtureBuy.$set('fixture_detail', fixture);
          fixture.$add('fixtures', fixtureBuy);
          /* Por cada pronostico reviso si existe el id del partido, creo el pronostico y lo agrego a ese partido y al fixture comprado por el user */
          const resultsMatchesAdd: Promise<{
            match_id: number;
            status: string;
          }>[] = matches.map(async (m) => {
            const isMatch = await MatchesPrototypes.findByPk(m.match_id);
            if (isMatch) {
              const newPronostic = await Pronostics.create({
                pronostic_one: m.pronostic_one,
                pronostic_two: m.pronostic_two,
              });
              isMatch.$add('pronostics', newPronostic);
              fixtureBuy.$add('pronostics', newPronostic);
              newPronostic.$set('fixture', fixtureBuy);
              newPronostic.$set('match', isMatch);
              return { match_id: m.match_id, status: 'success' };
            } else {
              return {
                match_id: m.match_id,
                status: 'error',
                message: 'No existe en la BD un partido con este id',
              };
            }
          });
          Promise.all(resultsMatchesAdd).then((value) => {
            return res.send({ fixture: fixtureBuy, matches: value });
          });
        } else {
          return res.status(404).send('No se encontro un fixture con ese id');
        }
      } else {
        return res
          .status(400)
          .send('No se encontro un usuario, inicia sesion para continuar');
      }
    } catch (e: any) {
      return res.status(404).send(e.message);
    }
  }
);

export default buyFixturePrototype;
