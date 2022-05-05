import { Router, Request } from 'express';
import { FixturesPrototypes, MatchesPrototypes } from '../../../models';

const editMatchPrototype = Router();

type ReqBodyAddFixture = {
  team_one: string;
  team_two: string;
  result_one?: number;
  result_two?: number;
  date_match?: Date;
  stadium?: string;
  fixture_id?: number;
};

editMatchPrototype.put(
  '/:id',
  /*isAdmin,*/
  async (req: Request<{ id: string }, {}, ReqBodyAddFixture>, res, next) => {
    try {
      const {
        team_one,
        team_two,
        date_match,
        result_one,
        result_two,
        stadium,
      } = req.body;
      const matchId = req.params.id;
      const match = await MatchesPrototypes.findByPk(matchId);

      if (match) {
        match.update({
          team_one,
          team_two,
          date_match,
          result_one,
          result_two,
          stadium,
        });
        res.send(match);
      } else {
        res.status(404).send('No se encontro un partido con ese id');
      }
    } catch (e: any) {
      res.status(404).send(e.message);
    }
  }
);

export default editMatchPrototype;
