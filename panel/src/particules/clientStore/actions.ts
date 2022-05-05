import { IUser } from '../../utils/types/UserTypes';

export type AuthActions =
  | { type: 'LOGOUT' }
  | {
      type: 'AUTH';
      payload: {
        csrfToken: string;
      };
    }
  | {
      type: 'SET_USER';
      payload: IUser;
    };

export type AlertActions = {
  type: 'ALERT';
  payload: {
    open: boolean;
    // config?: Omit<IAlertProps, 'onClose' | 'open'>;
    content?: React.ReactNode;
  };
};

export type ToastActions = {
  type: 'TOAST';
  payload: {
    open: boolean;
    // config?: Omit<IToastProps, 'onClose' | 'open'>;
  };
};

export type LoadingActions = {
  type: 'LOADING';
  payload: boolean;
};

export type Actions =
  | AuthActions
  | AlertActions
  | ToastActions
  | LoadingActions;
