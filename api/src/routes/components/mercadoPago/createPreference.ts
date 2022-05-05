import axios from 'axios';
import { Router, Request } from 'express';
import mercadopago from 'mercadopago';
import isAuthenticate from '../../../hooks/authentication/isAuthenticate';
import { validateEmptyField } from '../../../hooks/validations/useValidations';
import { Fixtures, FixturesPrototypes, PaymentsCards } from '../../../models';
import { paymentsTypes } from '../../../models/paymentCard/paymentsCards.types';
import { configMpHeader } from './addPayment';
import { getCard, getPaymentDetail } from './utils';

type Preference = {
  items: {
    title: any;
    unit_price: number;
    quantity: number;
  }[];
  back_urls: {
    success: string;
    failure: string;
    pending: string;
  };
  statement_descriptor: string;
  auto_return: 'approved' | 'all' | undefined;
  // notification_url: string;
};

const { MP_URL_CLIENT, MP_ACCESS_TOKEN } = process.env;

const createPreference = Router();

/* Crea una preferencia de pago para un fixture (me devuleve un link que me permite pagar desde MP) */
createPreference.post(
  '/create_preference',
  /* isAdmin, */
  async (
    req: Request<{}, {}, { fixture_id: number; title: string; price: number }>,
    res,
    next
  ) => {
    try {
      if (MP_ACCESS_TOKEN) {
        const { fixture_id, title, price } = req.body;

        const objectNoNull = { fixture_id, title, price };
        /* Reviso los campos requeridos  */
        const errorResponse = validateEmptyField(objectNoNull);
        if (errorResponse) {
          return res.status(404).send(errorResponse);
        }

        const fixturePrototype = await FixturesPrototypes.findByPk(fixture_id);
        if (fixturePrototype) {
          if (fixturePrototype.preference_id) {
            /* Si ya tiene una preferencia de pago en la BD solo la devuelvo */
            return res.send({
              message: 'El fixture ya tiene una preferencia de pago creada',
              preference_id: fixturePrototype.preference_id,
              url: `${MP_URL_CLIENT}/redirect?pref_id=${fixturePrototype.preference_id}`,
            });
          }

          /* Si no tiene, enonces creo la guardo en la BD y la mando */
          mercadopago.configure({
            access_token: MP_ACCESS_TOKEN,
          });
          let preference: Preference = {
            items: [
              {
                title,
                unit_price: price,
                quantity: 1, /// Number(req.body.quantity),
              },
            ],
            back_urls: {
              success: 'http://localhost:3001/payments/status',
              failure: 'http://localhost:3001/payments/status',
              pending: 'http://localhost:3001/payments/status',
            },
            auto_return: 'approved',
            statement_descriptor: `Mi Pronostico - ${title}`,
            // notification_url: 'http://localhost:3001/payments/statusMP',
          };

          mercadopago.preferences
            .create(preference)
            .then(function (response) {
              fixturePrototype.update({ preference_id: response.body.id });
              return res.send({
                id: response.body.id,
                url: response.body.init_point,
              });
            })
            .catch(function (error) {
              return res.status(404).send(error);
            });
        } else {
          return res
            .status(404)
            .send(`No se encontro un fixture con el id ${fixture_id}`);
        }
      }
    } catch (e: any) {
      res.status(404).send(e.message);
    }
  }
);

createPreference.get(
  '/status/:fixture_id',
  /* isAuthenticate, */
  async (
    req: Request<{ fixture_id: string }, {}, { payment_id?: string }>,
    res,
    next
  ) => {
    /* Aca voy a entrar cada vez que vaya a la pagina http://mipronostico.com.ar/status_pay
      y ahi reviso si el fixture tiene payment_id si no lo cargo y consulto con ese id https://api.mercadopago.com/v1/payments/{id}
      tiene un campo status -> que tiene que decir approved entonces el usuario ya puede cargar los datos del prode.
      Si no esta aprove le puedo generar el link de pago 
    */
    try {
      const fixture_id = req.params.fixture_id;
      const user_id = 1; /// req.session.user.id;
      const { payment_id } = req.body;

      const fixture = await Fixtures.findOne({
        where: { id: fixture_id, user_id },
      });
      if (fixture) {
        /* Si el fixture ya fue comprado anteriormente */
        if (fixture.payment_status === 'approved') {
          return res.send({
            payment_id: fixture.payment_id,
            status: fixture.payment_status,
            message: 'El fixture ya fue comprado',
          });
        }

        if (payment_id) {
          getPaymentDetail({ payment_id })
            .then(({ data: statusPayment }) => {
              /* Si el pago fue aprobado */
              if (statusPayment.status === 'approved') {
                fixture.$set('payment_status', 'approved');
                fixture.$set('payment_id', payment_id);
                return res.send({
                  payment_id: payment_id,
                  status: statusPayment.status,
                  message: 'El pago fue aprobado',
                });
              } else {
                /* Si el pago esta pendiente o fue tuvo un error */
                res.send({
                  payment_id: payment_id,
                  status: statusPayment.status,
                  payment_method_id: statusPayment.payment_method_id,
                  status_detail: statusPayment.status_detail,
                  transaction_details: statusPayment.transaction_details,
                });
              }
            })
            .catch((e) => {
              return res.status(400).send(e.response.data);
            });
        }
      } else {
        res.status(404).send(`No existe un fixture con el id ${fixture_id}`);
      }
      console.log(
        'ENTRO AL STATUS DEL GET DESPUES DEL RESPSONSE 67',
        req.query
      );
      res.sendStatus(200);
    } catch (e: any) {
      res.status(404).send(e.message);
    }
  }
);

createPreference.post(
  '/statusMP',
  /* isAuthenticate, */
  async (req, res, next) => {
    try {
      console.log(
        'ENTRO AL STATUS DEL POSST DESPUES DEL RESPSONSE 67',
        req.query,
        'BODY ->',
        req.body
      );
      res.sendStatus(200);
    } catch (e: any) {
      res.status(404).send(e.message);
    }
  }
);

export default createPreference;
