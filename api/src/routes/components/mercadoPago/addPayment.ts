import { Router, Request } from 'express';
import isAuthenticate from '../../../hooks/authentication/isAuthenticate';
import { PaymentsCards, Users } from '../../../models';
import axios from 'axios';
import { validateEmptyField } from '../../../hooks/validations/useValidations';

const { MP_ACCESS_TOKEN, MP_PUBLIC_API_KEY, MP_URL_API } = process.env;

type ReqBodyAddPayment = {
  card_number: string;
  cardholder: {
    name: string;
    identification: {
      type: string;
      number: string;
    };
  };
  expiration_month: number;
  expiration_year: number;
  security_code: string;
};

const addPayment = Router();

export const configMpHeader = {
  headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
};

addPayment.post(
  '',
  isAuthenticate,
  async (req: Request<{}, {}, ReqBodyAddPayment>, res, next) => {
    try {
      const {
        card_number,
        cardholder,
        expiration_month,
        expiration_year,
        security_code,
      } = req.body;

      const objectNoNull = {
        card_number,
        expiration_month,
        expiration_year,
        security_code,
        name: cardholder.name,
        identification_type: cardholder.identification.type,
        identification_number: cardholder.identification.number,
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

      /* Si tiene cuenta, entonces solo hay que asociarle la nueva tarjeta */
      if (mp_user) {
        /* POST para obtener el token id de la nueva tarjeta */
        axios
          .post(
            `${MP_URL_API}/card_tokens?public_key=${MP_PUBLIC_API_KEY}&locale=en&js_version=2.0.0`,
            {
              card_number,
              cardholder,
              expiration_month,
              expiration_year,
              security_code,
            }
          )
          .then(({ data: getToken }) => {
            /* POST para guardar la tarjeta al usuario */
            axios
              .post(
                `${MP_URL_API}/customers/${mp_user.customer_id}/cards`,
                {
                  token: getToken.id,
                },
                configMpHeader
              )
              .then(({ data: cardData }) => {
                return res.send(cardData);
              });
          })
          .catch((error) => {
            return res
              .status(400)
              .send({ line: 95, error: error.response.data });
          });
      } else {
        const dataUser = await Users.findByPk(idUser);
        if (dataUser) {
          const { email, name, lastname } = dataUser;
          /* Busco el cliente en MP para saber si ya existe*/
          axios
            .get(
              `${MP_URL_API}/customers/search?email=${email}`,
              configMpHeader
            )
            .then(({ data: userMP }) => {
              if (userMP.results.length) {
                /* Si existe el cliente en la BD de MP*/
                /* Almaceno el id del cliente en nuestra BD*/
                PaymentsCards.create({
                  customer_id: userMP.results[0].id,
                  user_id: String(idUser),
                });

                /* POST para obtener el token id de la nueva tarjeta */
                axios
                  .post(
                    `${MP_URL_API}/card_tokens?public_key=${MP_PUBLIC_API_KEY}&locale=en&js_version=2.0.0`,
                    {
                      card_number,
                      cardholder,
                      expiration_month,
                      expiration_year,
                      security_code,
                    }
                  )
                  .then(({ data: getToken }) => {
                    /* POST para guardar la tarjeta al usuario */
                    axios
                      .post(
                        `${MP_URL_API}/customers/${userMP.results[0].id}/cards`,
                        {
                          token: getToken.id,
                        },
                        configMpHeader
                      )
                      .then(({ data: cardData }) => {
                        return res.send(cardData);
                      })
                      .catch((err) => {
                        return res
                          .status(400)
                          .send({ line: 144, error: err.response.data });
                      });
                  })
                  .catch((err) => {
                    return res
                      .status(400)
                      .send({ line: 151, error: err.response.data });
                  });
              } else {
                /* No existe el cliente en MP ni en nuestra Api -> POST para crear el usuario en MP*/
                axios
                  .post(
                    `${MP_URL_API}/customers`,
                    {
                      email,
                      first_name: name,
                      last_name: lastname,
                      identification: cardholder.identification,
                    },
                    configMpHeader
                  )
                  .then(({ data: createCustomer }) => {
                    /* Una vez creado el usuario almaceno el id de cliente de MP en la BD */
                    PaymentsCards.create({
                      customer_id: createCustomer.id,
                      user_id: String(idUser),
                    });

                    /* POST para obtener el token id de la nueva tarjeta */
                    axios
                      .post(
                        `${MP_URL_API}/card_tokens?public_key=${MP_PUBLIC_API_KEY}&locale=en&js_version=2.0.0`,
                        {
                          card_number,
                          cardholder,
                          expiration_month,
                          expiration_year,
                          security_code,
                        }
                      )
                      .then(({ data: getToken }) => {
                        /* POST para guardar la tarjeta al usuario */
                        axios
                          .post(
                            `${MP_URL_API}/customers/${createCustomer.id}/cards`,
                            {
                              token: getToken.id,
                            },
                            configMpHeader
                          )
                          .then(({ data: cardData }) => {
                            return res.send(cardData);
                          })
                          .catch((err) => {
                            return res
                              .status(400)
                              .send({ line: 199, error: err.response.data });
                          });
                      })
                      .catch((err) => {
                        return res
                          .status(400)
                          .send({ line: 205, error: err.response.data });
                      });
                  })
                  .catch((err) => {
                    return res
                      .status(400)
                      .send({ line: 201, error: err.response.data });
                  });
              }
            })
            .catch((e) => {
              return res.status(400).send(e.response.data);
            });
        } else {
          return res
            .status(404)
            .send('No se encontro un usuario o sesión activa.');
        }
      }
    } catch (e: any) {
      res.status(404).send(e.message);
    }
  }
);

export default addPayment;
