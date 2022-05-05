import { IAuth, IUser } from '../../utils/types/UserTypes';
import { Actions } from './actions';

export type ClientDispatch = {
  dispatch: (action: Actions) => void;
};

export type ClientStore = {
  authentication: {
    user: IUser | null;
    auth: IAuth | null;
  };
  alert: {
    open: boolean;
    //config?: Omit<IAlertProps, 'onClose' | 'open'>;
    content?: React.ReactNode;
  };
  toast: {
    open: boolean;
    // config?: Omit<IToastProps, 'onClose' | 'open'>;
  };
  isLoading: boolean;
};
