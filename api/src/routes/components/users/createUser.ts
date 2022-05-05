import { Router, Request } from 'express';
import useHashPassword from '../../../hooks/authentication/useHashPassword';
import {
  AdminAttributes,
  UsersAttributes,
} from '../../../models/users/users.types';
import registerValidations from '../../../hooks/validations/useValidations';
import { TErrorRegister } from '../../../hooks/validations/validations.types';
import { Users } from '../../../models';
import isApiKey from '../../../hooks/authentication/isApiKey';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

const createUser = Router();

// <---Crea clientes nuevos--->
createUser.post(
  '/create-user',
  isApiKey,
  async (req: Request<{}, {}, UsersAttributes>, res, next) => {
    // Si se loguea de app entonces devuelvo Tokens de lo contrario el crfs para web.
    const { X_API_KEY_APP, SECRET_JWT, SECRET_JWT_REFRESH } = process.env;
    const isApp = req.headers['x-api-key'] === X_API_KEY_APP;
    try {
      const { name, lastname, email, password } = req.body;
      let errorResponse: TErrorRegister | {} = {};
      let object: { [key: string]: string | undefined } = {
        name,
        lastname,
        email,
        role: 'client',
        password,
      };
      for (const key in object) {
        if (!object[key]) {
          errorResponse = {
            ...errorResponse,
            [key]: ['This field is required'],
          };
        }
      }

      //Si algun campo requerido esta vacio
      if (Object.keys(errorResponse).length) {
        return res.status(400).send(errorResponse);
      }
      //Otras validaciones:
      const errorValidations = registerValidations({
        ...req.body,
        role: 'client',
      });
      if (errorValidations) {
        return res.status(400).send(errorValidations);
      }
      //Revisamos si no existe el email.
      Users.findAll({
        where: { email: email.toLocaleLowerCase() },
      }).then((data) => {
        if (data.length) {
          //Si existe el email en la bd:
          return res
            .status(400)
            .send({ email: ['La dirección de correo ya esta en uso'] });
        } else {
          //Si no existe, crea el user:
          useHashPassword(req.body.password).then((hashPassword) => {
            let bodyUser = { ...req.body, password: hashPassword };
            Users.create({
              ...bodyUser,
              email: email.toLocaleLowerCase(),
              role: 'client',
            })
              .then((user) => {
                /*   const responseUser = { ...user.toJSON(), password: undefined };
                res.send(responseUser); */
                if (isApp) {
                  // App token
                  if (SECRET_JWT && SECRET_JWT_REFRESH) {
                    const accessToken = jwt.sign(
                      { id: user.id, role: user.role },
                      SECRET_JWT,
                      { expiresIn: '1d' }
                    );
                    const refreshToken = jwt.sign(
                      { id: user.id, role: user.role },
                      SECRET_JWT_REFRESH,
                      { expiresIn: '30d' }
                    );
                    res.send({
                      accessToken: accessToken,
                      refreshToken: refreshToken,
                    });
                  } else {
                    res.status(400).send('Api error, does not exist secretJWT');
                  }
                } else {
                  //CRFS token para web
                  const csrfToken = randomBytes(100).toString('base64');
                  req.session.user = {
                    id: user.id,
                    role: user.role,
                    csrf: csrfToken,
                  };
                  res.send({ csrfToken: csrfToken });
                }
              })
              .catch((e) => {
                res.status(400).send(e);
              });
          });
        }
      });
    } catch (e) {
      next(e);
    }
  }
);

// <--- Crea usuarios developer o admin, se requiere un secret hash--->
createUser.post(
  '/create-admin',
  isApiKey,
  async (req: Request<{}, {}, AdminAttributes>, res, next) => {
    try {
      const { name, lastname, email, password, role, secretKey } = req.body;
      let errorResponse: TErrorRegister | {} = {};
      let object: { [key: string]: string } = {
        name,
        lastname,
        email,
        role,
        password,
      };
      for (const key in object) {
        if (!object[key]) {
          errorResponse = {
            ...errorResponse,
            [key]: ['This field is required'],
          };
        }
      }

      //Si algun campo requerido esta vacio
      if (Object.keys(errorResponse).length) {
        return res.status(400).send(errorResponse);
      }

      //Revisamos si no existe el email.
      Users.findAll({
        where: { email: email.toLocaleLowerCase() },
      }).then((data) => {
        if (data.length) {
          //Si existe el email en la bd:
          return res
            .status(400)
            .send({ email: 'This email is already in use' });
        } else {
          //Si no existe, compara la SECRET KEY  y crea el user:
          if (secretKey === process.env.SECRET_KEY_ADMIN_CREATE) {
            useHashPassword(req.body.password).then((hashPassword) => {
              let bodyUser = { ...req.body, password: hashPassword };

              Users.create({ ...bodyUser, email: email.toLocaleLowerCase() })
                .then((user) => {
                  const responseUser = {
                    ...user.toJSON(),
                    password: undefined,
                  };
                  res.send(responseUser);
                })
                .catch((e) => {
                  res.send(e);
                });
            });
          } else {
            return res
              .status(400)
              .send(
                'You do not have permissions to create this user. Invalid SK.'
              );
          }
        }
      });
    } catch (e) {
      next(e);
    }
  }
);

export default createUser;
