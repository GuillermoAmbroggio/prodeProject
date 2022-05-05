import { Router } from 'express';
import {
  Fixtures,
  FixturesPrototypes,
  MatchesPrototypes,
  Pronostics,
} from '../../../models';

const getFixturePrototype = Router();

getFixturePrototype.get('', async (req, res, next) => {
  try {
    const fixtures = await FixturesPrototypes.findAll({
      include: [MatchesPrototypes],
    });
    res.send(fixtures);
  } catch (e: any) {
    res.status(404).send(e.message);
  }
});

getFixturePrototype.get('/:id', async (req, res, next) => {
  try {
    const fixtureId = req.params.id;
    const fixture = await FixturesPrototypes.findOne({
      where: { id: fixtureId },
      include: [MatchesPrototypes],
    });

    if (fixture) {
      const { MP_URL_CLIENT } = process.env;
      const url = fixture.preference_id
        ? `${MP_URL_CLIENT}/redirect?pref_id=${fixture.preference_id}`
        : undefined;
      ////               url: `${MP_URL_CLIENT}/redirect?pref_id=${fixturePrototype.preference_id}`,
      return res.send({
        ...fixture.toJSON(),
        url,
      });
    } else {
      return res.status(404).send('No se encontro un fixture con ese id');
    }
  } catch (e: any) {
    return res.status(404).send(e.message);
  }
});

export default getFixturePrototype;
