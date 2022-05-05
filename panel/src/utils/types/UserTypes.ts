export type IAuth = {
  csrfToken: string;
};

export type ILogin = {
  email: string;
  password: string;
};

export type IUser = {
  email: string;
  name: string;
  lastname: string;
  password: string;
  phone?: string;
  country?: string;
  birthdate?: string;
};

export type IEditUser = {
  name: string;
  lastname: string;
  email: string;
  date: string;
};

export type IEditPassword = {
  password: string;
  newPassword: string;
  confirmNewPassword: string;
};
