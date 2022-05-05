import axios from 'axios';
import { Router } from 'express';
import isAuthenticate from '../../../hooks/authentication/isAuthenticate';
import { PaymentsCards } from '../../../models';
import { paymentsTypes } from '../../../models/paymentCard/paymentsCards.types';
import { configMpHeader } from './addPayment';
import { getCard } from './utils';

const { MP_URL_API } = process.env;

const getPayment = Router();

/* Busca todas las tarjetas de un cliente */
getPayment.get('/cards', isAuthenticate, async (req, res, next) => {
  try {
    const idUser = req.session.user.id;

    /* Reviso en la BD si el usuario ya tiene cuenta con MP */
    const mp_user = await PaymentsCards.findOne({
      where: {
        user_id: idUser,
      },
    });

    /* Si tiene cuenta, entonces busco si tiene tarjetas cargadas */
    if (mp_user) {
      axios
        .get(
          `${MP_URL_API}/customers/${mp_user.customer_id}/cards`,
          configMpHeader
        )
        .then(({ data: dataCards }) => {
          res.send(dataCards);
        })
        .catch((e) => {
          res.status(400).send(e.response.data);
        });
    } else {
      /* Si no tiene cuenta, entonces tampoco tendra tarjetas */
      res.send([]);
    }
  } catch (e: any) {
    res.status(404).send(e.message);
  }
});

/* Busca una tarjeta de un cliente */
getPayment.get(
  '/cards/:cardId',
  /* isAuthenticate,*/ async (req, res, next) => {
    try {
      // const idUser = req.session.user.id;
      const cardId = req.params.cardId;
      /* Reviso en la BD si el usuario ya tiene cuenta con MP */
      const mp_user = await PaymentsCards.findOne({
        where: {
          user_id: '1', // idUser,
        },
      });

      /* Si tiene cuenta, entonces busco si tiene la tarjeta */
      if (mp_user) {
        getCard({ cardId, customer_id: mp_user.customer_id })
          .then(({ data: dataCard }) => {
            res.send(dataCard);
          })
          .catch((e) => {
            res.status(400).send(e.response.data);
          });
      } else {
        /* Si no tiene cuenta, entonces tampoco tendra tarjetas */
        res.send([]);
      }
    } catch (e: any) {
      res.status(404).send(e.message);
    }
  }
);

/* Devuelve los tipos de pagos que manejamos */
getPayment.get('/types', isAuthenticate, async (req, res, next) => {
  try {
    res.send(paymentsTypes);
  } catch (e: any) {
    res.status(404).send(e.message);
  }
});

export default getPayment;
