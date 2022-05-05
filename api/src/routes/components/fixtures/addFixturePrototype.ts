import { Router, Request } from 'express';
import isAdmin from '../../../hooks/authentication/isAdmin';
import { validateEmptyField } from '../../../hooks/validations/useValidations';
import { Fixtures, FixturesPrototypes } from '../../../models';

const addFixturePrototype = Router();

type ReqBodyAddFixture = {
  name: string;
  start_date: Date;
};

addFixturePrototype.post(
  '',
  /*isAdmin,*/
  async (req: Request<{}, {}, ReqBodyAddFixture>, res, next) => {
    try {
      const { name, start_date } = req.body;

      const objectNoNull = {
        name,
        start_date,
      };
      /* Reviso los campos requeridos  */
      const errorResponse = validateEmptyField(objectNoNull);
      if (errorResponse) {
        return res.status(404).send(errorResponse);
      }

      /* Reviso en la BD si existe el fixture */
      const fixture = await FixturesPrototypes.findOne({
        where: {
          name,
        },
      });

      if (fixture) {
        res.status(404).send('Ya existe un fixture con ese nombre');
      } else {
        FixturesPrototypes.create({
          name,
          start_date,
        })
          .then((fixture) => {
            res.send(fixture);
          })
          .catch((error) => {
            return res.status(404).send(error);
          });
      }
    } catch (e: any) {
      res.status(404).send(e.message);
    }
  }
);

export default addFixturePrototype;
