import axios from 'axios';
import { IAuth, ILogin } from '../../../../utils/types/UserTypes';

type IPostLogin = ({ email, password }: ILogin) => Promise<IAuth>;

const postLogin: IPostLogin = async ({ email, password }) => {
  const { data }: { data: IAuth } = await axios.post(
    '/login',
    {
      email,
      password,
    },
    { withCredentials: true }
  );
  return data;
};

export default postLogin;
