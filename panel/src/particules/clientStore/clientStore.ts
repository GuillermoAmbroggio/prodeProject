import { ClientStore } from './clientStore.types';

export const initialClientStore: ClientStore = {
  authentication: {
    user: null,
    auth: null,
  },
  alert: {
    open: false,
  },
  toast: {
    open: false,
    // config: { variant: 'success' },
  },
  isLoading: false,
};
