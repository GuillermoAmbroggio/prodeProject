import { axiosFetch } from '../../../../utils';
import { IEditUser } from '../../../../utils/types/UserTypes';

type IPostLogin = (body: IEditUser) => Promise<any>;

const postEditUser: IPostLogin = async (body) => {
  return await axiosFetch('/users/edit-data', {
    method: 'PUT',
    data: body,
  }).then((response) => {
    return response;
  });
};

export default postEditUser;
