import { axiosFetch } from '../../../../utils';

type IGetUser = () => Promise<any>;

const getUser: IGetUser = async () => {
  return await axiosFetch('/users').then((response) => {
    return response;
  });
};

export default getUser;
