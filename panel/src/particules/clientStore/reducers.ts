import { Actions } from './actions';
import { ClientStore } from './clientStore.types';

const reducer = (draft: ClientStore, action: Actions): void => {
  switch (action.type) {
    case 'LOGOUT':
      void localStorage.removeItem('user');
      void localStorage.removeItem('auth');
      draft.authentication.user = null;
      draft.authentication.auth = null;
      break;

    case 'AUTH': {
      const { csrfToken } = action.payload;
      draft.authentication.auth = action.payload;
      void localStorage.setItem(
        'auth',
        JSON.stringify({
          csrfToken,
        })
      );
      break;
    }

    case 'SET_USER': {
      const user = action.payload;
      draft.authentication.user = user;
      break;
    }

    /*     case 'ALERT': {
      const { config, open, content } = action.payload;
      draft.alert.config = config;
      draft.alert.content = content;
      draft.alert.open = open;
      break;
    } */

    /*     case 'TOAST': {
      const { config, open } = action.payload;
      draft.toast.config = config;
      draft.toast.open = open;
      break;
    } */

    case 'LOADING': {
      draft.isLoading = action.payload;
      break;
    }
    default:
      throw new Error('Invalid action type');
  }
};

export default reducer;
