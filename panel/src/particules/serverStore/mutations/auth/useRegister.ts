import { useMutation, UseMutationResult } from 'react-query';
import { useClientStore } from '../../../../hooks';
import { IAuth, IUser } from '../../../../utils/types/UserTypes';
import { getUser, postRegister } from '../../request';

import useLogout from './useLogout';

const useRegister: () => UseMutationResult<IAuth, any, IUser, unknown> = () => {
  const { dispatch } = useClientStore();
  const { mutate } = useLogout();
  return useMutation(postRegister, {
    onSuccess: async (data) => {
      dispatch({ type: 'AUTH', payload: data });
      getUser()
        .then((user) => {
          dispatch({ type: 'SET_USER', payload: user });
        })
        .catch(() => {
          mutate();
        });
    },
  });
};

export default useRegister;
