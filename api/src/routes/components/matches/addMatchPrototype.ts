import { Router, Request } from 'express';
import isAdmin from '../../../hooks/authentication/isAdmin';
import { validateEmptyField } from '../../../hooks/validations/useValidations';
import { FixturesPrototypes, MatchesPrototypes } from '../../../models';

const addMatchPrototype = Router();

type ReqBodyAddMatch = {
  team_one: string;
  team_two: string;
  date_match?: Date;
  stadium?: string;
  fixture_id: string; //fecha1
};

addMatchPrototype.post(
  '',
  /*isAdmin,*/
  async (req: Request<{}, {}, ReqBodyAddMatch>, res, next) => {
    try {
      const { fixture_id, team_one, team_two, date_match, stadium } = req.body;

      const objectNoNull = {
        fixture_id,
        team_one,
        team_two,
      };
      /* Reviso los campos requeridos de la tarjeta */
      const errorResponse = validateEmptyField(objectNoNull);
      if (errorResponse) {
        return res.status(404).send(errorResponse);
      }

      /* Reviso en la BD si existe el fixture */
      const fixture = await FixturesPrototypes.findByPk(fixture_id);

      if (fixture) {
        const newMatch = await MatchesPrototypes.create({
          team_one,
          team_two,
          date_match,
          stadium,
        });
        fixture.$add('matches', newMatch);
        newMatch.$set('fixture', fixture);
        res.send(newMatch);
      } else {
        res.status(404).send('No se encontro un fixture con ese id');
      }
    } catch (e: any) {
      res.status(404).send(e.message);
    }
  }
);

export default addMatchPrototype;
