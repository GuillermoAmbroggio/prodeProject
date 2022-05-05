import { Router, Request } from 'express';
import useHashPassword, {
  comparePassword,
} from '../../../hooks/authentication/useHashPassword';
import {
  validatePassword,
  validatePhone,
} from '../../../hooks/validations/useValidations';
import { TErrorRegister } from '../../../hooks/validations/validations.types';
import { UsersAttributes } from '../../../models/users/users.types';
import { Users } from '../../../models';
import isAuthenticate from '../../../hooks/authentication/isAuthenticate';

const editUser = Router();

// <---Permite editar nombre, apellido, cumpleaños, pais y telefono--->
editUser.put(
  '/edit-data',
  isAuthenticate,
  async (req: Request<{}, {}, UsersAttributes>, res, next) => {
    const idUser = req.session.user.id;
    const user = await Users.findByPk(idUser);
    if (user) {
      const { name, lastname, birthdate, country, phone } = req.body;
      // Validacion del telefono, si lo ingresa:
      let errorValidations: {} | undefined = undefined;
      if (phone && !validatePhone(phone)) {
        errorValidations = {
          phone: ['The phone format is not valid'],
        };
      }
      if (errorValidations) {
        return res.status(400).send(errorValidations);
      }
      user
        .update({ name, lastname, birthdate, country, phone })
        .then(() => {
          res.send({ ...user.toJSON(), password: undefined, role: undefined });
        })
        .catch((err) => {
          res.status(400).send('User not updated.');
        });
    } else {
      res.status(404).send('User not found');
    }
  }
);

// <---Permite editar contraseña del usuario--->
editUser.put(
  '/edit-password',
  isAuthenticate,
  async (
    req: Request<
      {},
      {},
      { password: string; newPassword: string; confirmNewPassword: string }
    >,
    res
  ) => {
    const idUser = req.session.user.id;
    const user = await Users.findByPk(idUser);
    if (user) {
      const { password, newPassword, confirmNewPassword } = req.body;
      let errorResponse: { [key: string]: string | undefined } = {};
      if (!password || !password.length) {
        errorResponse = {
          ...errorResponse,
          password: 'Contraseña requerida', // This field is required'
        };
      }
      if (!newPassword || !newPassword.length) {
        errorResponse = {
          ...errorResponse,
          newPassword: 'Nueva contraseña requerida', // This field is required
        };
      }
      if (!confirmNewPassword || !confirmNewPassword.length) {
        errorResponse = {
          ...errorResponse,
          confirmNewPassword: 'Confirmacion de contraseña requerida', // This field is required
        };
      }
      //Si algun campo requerido esta vacio
      if (Object.keys(errorResponse).length) {
        return res.status(400).send(errorResponse);
      }
      comparePassword(password, user.password)
        .then((isCorrect) => {
          if (isCorrect) {
            if (newPassword !== confirmNewPassword) {
              res.status(400).send('Las nuevas contraseñas no coinciden'); // New passwords entered do not match
            } else {
              const passwordError = validatePassword(newPassword);
              if (passwordError.length) {
                res.status(400).send({ newPassword: passwordError });
              } else {
                useHashPassword(newPassword)
                  .then((hashPassword) => {
                    user.update({ password: hashPassword });
                    res.send('Contraseña actualizada'); // Updated password
                  })
                  .catch((e) => res.status(400).send(e));
              }
            }
          } else {
            res.status(400).send('La contraseña actual no es correcta'); // The password of the account entered is not correct
          }
        })
        .catch((e) => res.status(400).send(e));
    } else {
      res.status(404).send('Usuario no encontrado'); // User not found
    }
  }
);

export default editUser;
