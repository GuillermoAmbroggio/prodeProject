import { Router, Request } from 'express';
import {
  Fixtures,
  FixturesPrototypes,
  MatchesPrototypes,
  Pronostics,
} from '../../../models';

const calculateResults = Router();

calculateResults.get(
  '/:id',
  /*isAdmin,*/
  async (req: Request<{ id: string }, {}, {}>, res, next) => {
    try {
      const fixtureId = req.params.id;
      const fixture = await FixturesPrototypes.findByPk(fixtureId, {
        include: [
          {
            model: MatchesPrototypes,
            attributes: [
              'id',
              'team_one',
              'team_two',
              'result_one',
              'result_two',
            ],
          },
          {
            model: Fixtures,
            include: [Pronostics],
            order: [['results_points', 'ASC']],
          },
        ],
      });

      if (fixture) {
        if (fixture.fixtures?.length) {
          if (fixture.matches && fixture.matches?.length) {
            fixture.fixtures.forEach((fix) => {
              if (fix.pronostics?.length) {
                const resultsPronosticsArray: number[] = [];
                const allMatches = fixture.matches ?? [];
                const allPronostics = fix.pronostics;
                for (let i = 0; i < allMatches.length; i++) {
                  for (let j = 0; j < allPronostics.length; j++) {
                    const selectMatch = allMatches[i];
                    const selectPronostic = allPronostics[j];
                    /* Si recorriendo los pronosticos encuentro un pronostico para el partido */
                    if (selectMatch.id === selectPronostic.match_id) {
                      /* Si el pronostico conincide totalmente le sumo 2 puntos */
                      if (
                        selectMatch.result_one ===
                          selectPronostic.pronostic_one &&
                        selectMatch.result_two === selectPronostic.pronostic_two
                      ) {
                        selectPronostic.update({ results_points: 2 });
                        resultsPronosticsArray.push(2);
                      } else if (
                        /* Si no existe algun resultado todavia o no tiene pornosticos cargados para ese partido se asigna 0 */
                        typeof selectMatch.result_one != 'number' ||
                        typeof selectMatch.result_two != 'number' ||
                        typeof selectPronostic.pronostic_one != 'number' ||
                        typeof selectPronostic.pronostic_two != 'number'
                      ) {
                        selectPronostic.update({ results_points: null });
                        resultsPronosticsArray.push(0);
                      } else if (
                        /* Si gano el equipo 1 y acerto  se le suma 1 punto*/
                        selectMatch.result_one > selectMatch.result_two &&
                        selectPronostic.pronostic_one >
                          selectPronostic.pronostic_two
                      ) {
                        selectPronostic.update({ results_points: 1 });
                        resultsPronosticsArray.push(1);
                      } else if (
                        /* Si gano el equipo 2 y acerto  se le suma 1 punto*/
                        selectMatch.result_one < selectMatch.result_two &&
                        selectPronostic.pronostic_one <
                          selectPronostic.pronostic_two
                      ) {
                        selectPronostic.update({ results_points: 1 });
                        resultsPronosticsArray.push(1);
                      } else if (
                        /* Si empataron y acerto  se le suma 1 punto*/
                        selectMatch.result_one === selectMatch.result_two &&
                        selectPronostic.pronostic_one ===
                          selectPronostic.pronostic_two
                      ) {
                        selectPronostic.update({ results_points: 1 });
                        resultsPronosticsArray.push(1);
                      } else {
                        /* Si no es ninguno de los anteriores le asigno null */
                        selectPronostic.update({ results_points: 0 });
                        resultsPronosticsArray.push(0);
                      }
                    }
                  }
                }
                const resultsPronostics = resultsPronosticsArray.reduce(
                  (accumulator, curr) => accumulator + curr
                );
                /* Si tiene pronosticos entonces actualizo el resultado del fixture*/

                fix.update({ results_points: resultsPronostics });
                console.log('CALCULATE RESULTS 101 ', { resultsPronostics });
              } else {
                /* Si no tiene pronosticos entonces el resultado del fixture es 0*/
                fix.update({ results_points: 0 });
              }
            });
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

export default calculateResults;
