import { Router } from 'express';
import isApiKey from '../../../../hooks/authentication/isApiKey';
import queryString from 'query-string';
require('dotenv').config();

const googleAuth = Router();
const { CLIENT_URL, CLIENT_ID_GOOGLE } = process.env;

// <---Loguea un usuario mediante google--->
googleAuth.get('/login-google', isApiKey, async (req, res, next) => {
  const stringifiedParams = queryString.stringify({
    client_id: CLIENT_ID_GOOGLE,
    //redirect_uri: `${CLIENT_URL}`,
    redirect_uri: `http://localhost:19006`,
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '), // space seperated string
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
  });
  res.send(stringifiedParams);
});

export default googleAuth;
