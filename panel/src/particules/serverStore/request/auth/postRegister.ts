import axios from 'axios';
import { IUser, IAuth } from '../../../../utils/types/UserTypes';

type IPostLogin = (body: IUser) => Promise<IAuth>;

const postRegister: IPostLogin = async (body) => {
  const { data }: { data: IAuth } = await axios.post(
    '/users/create-user',
    body,
    { withCredentials: true }
  );
  return data;
};

export default postRegister;
