import { Router } from 'express';
import isAuthenticate from '../../../hooks/authentication/isAuthenticate';
import { Users } from '../../../models';

const deleteUser = Router();

// <---Elimina el usuario--->
deleteUser.delete('/delete', isAuthenticate, async (req, res, next) => {
  const idUser = req.user.id;
  const user = await Users.findByPk(idUser);
  if (user) {
    user.destroy().then(() => {
      res.send('User deleted');
    });
  } else {
    res.status(404).send('User not found');
  }
});

export default deleteUser;
