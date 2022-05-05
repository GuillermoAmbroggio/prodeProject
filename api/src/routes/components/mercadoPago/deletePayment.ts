import axios from 'axios';
import { Router, Request } from 'express';
import isAuthenticate from '../../../hooks/authentication/isAuthenticate';
import { validateEmptyField } from '../../../hooks/validations/useValidations';
import { PaymentsCards } from '../../../models';
import { configMpHeader } from './addPayment';

const { MP_URL_API } = process.env;

const deletePayment = Router();

deletePayment.delete(
  '',
  isAuthenticate,
  async (req: Request<{}, {}, { card_id: string }>, res, next) => {
    try {
      const { card_id } = req.body;

      const objectNoNull = {
        card_id,
      };

      /* Reviso los campos requeridos de la tarjeta */
      const errorResponse = validateEmptyField(objectNoNull);
      if (errorResponse) {
        return res.status(400).send(errorResponse);
      }
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
          .delete(
            `${MP_URL_API}/customers/${mp_user.customer_id}/cards/${card_id}`,
            configMpHeader
          )
          .then(({ data: dataCard }) => {
            res.send(dataCard);
          })
          .catch((e) => {
            res.status(400).send(e.response.data);
          });
      } else {
        /* Si no tiene cuenta, entonces tampoco tendra tarjetas */
        res.send('El usuario no tiene tarjetas');
      }
    } catch (e: any) {
      res.status(404).send(e.message);
    }
  }
);

export default deletePayment;
