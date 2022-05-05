import { axiosFetch } from '../../../../utils';
import { IEditPassword } from '../../../../utils/types/UserTypes';

type IPostLogin = (body: IEditPassword) => Promise<any>;

const postEditPassword: IPostLogin = async (body) => {
  return await axiosFetch('/users/edit-password', {
    method: 'PUT',
    data: body,
  }).then((response) => {
    return response;
  });
};

export default postEditPassword;
