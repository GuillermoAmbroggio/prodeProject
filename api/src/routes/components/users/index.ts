import { Router } from 'express';
import createUser from './createUser';
import editUser from './editUser';
import searchUser from './searchUser';
import deleteUser from './deleteUser';

const users = Router();

users.use('', searchUser);
users.use('', createUser);
users.use('', editUser);
users.use('', deleteUser);

export default users;
