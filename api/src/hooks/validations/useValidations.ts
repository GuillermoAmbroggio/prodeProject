import { UsersAttributes } from '../../models/users/users.types';
import { TErrorObject, TErrorRegister } from './validations.types';
import { isValidPhoneNumber } from 'libphonenumber-js';

export const validatePhone = (phone: string) => {
  return isValidPhoneNumber(phone);
};

export const validateEmptyField = (object: TErrorObject) => {
  let errorResponse: TErrorObject | {} = {};

  for (const key in object) {
    if (!object[key]) {
      errorResponse = {
        ...errorResponse,
        [key]: ['This field is required'],
      };
    }
  }
  //Si algun campo requerido esta vacio
  if (Object.keys(errorResponse).length) {
    return errorResponse;
  } else {
    return false;
  }
};

export const isNumber = (num: string | number) => {
  if (typeof num === 'number') {
    return true;
  } else {
    return false;
  }
};

export const validatePassword = (password: string) => {
  const regexPasswordLowercase = new RegExp('^(?=.*[a-z]|[A-Z])');
  const regexPasswordNumeric = new RegExp('(?=.*[0-9])');
  const regexPasswordLonger = new RegExp('(?=.{8,})');
  let passError = [];
  if (!regexPasswordLowercase.test(password)) {
    passError.push('The password must start with a letter');
  }
  if (!regexPasswordLonger.test(password)) {
    passError.push('The password must be at least 8 characters long');
  }
  if (!regexPasswordNumeric.test(password)) {
    passError.push('The password must have at least one number');
  }
  return passError;
};

const registerValidations = (body: UsersAttributes) => {
  let errorResponse: TErrorRegister | {} = {};

  //Verifico Contraseña:
  const regexPasswordLowercase = new RegExp('^(?=.*[a-z]|[A-Z])');
  const regexPasswordNumeric = new RegExp('(?=.*[0-9])');
  const regexPasswordLonger = new RegExp('(?=.{8,})');

  let passError = validatePassword(body.password);

  if (passError.length) {
    errorResponse = { ...errorResponse, password: passError };
  }

  //Verifico roles:
  if (
    body.role === 'admin' ||
    body.role === 'client' ||
    body.role === 'developer'
  ) {
  } else {
    errorResponse = { ...errorResponse, role: ['This role is not valid'] };
  }

  //Verifico email:
  const regexEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!regexEmail.test(body.email)) {
    errorResponse = {
      ...errorResponse,
      email: ['Formato de correo inválido'],
    };
  }

  //Verifico telefono:
  if (body.phone && !validatePhone(body.phone)) {
    errorResponse = {
      ...errorResponse,
      phone: ['The phone format is not valid'],
    };
  }

  return Object.keys(errorResponse).length ? errorResponse : undefined;
};

export default registerValidations;
