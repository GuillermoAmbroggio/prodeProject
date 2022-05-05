import { useMutation } from 'react-query';
import { useClientStore } from '../../../../hooks';
import { postLogout } from '../../request';

const useLogout = () => {
  const { dispatch } = useClientStore();

  return useMutation(postLogout, {
    onSuccess: async () => {
      dispatch({ type: 'LOGOUT' });
      dispatch({ type: 'LOADING', payload: false });
    },
  });
};

export default useLogout;
