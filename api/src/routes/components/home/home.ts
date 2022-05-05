import { Router } from 'express';
const redoc = require('redoc-express');

const home = Router();

home.get('/swagger.json', (req, res) => {
  if (req.session.user && req.session.user.role !== 'client') {
    res.sendFile('swagger.json', { root: '.' });
  } else {
    res.sendStatus(404);
  }
});

// <---Eliminar--->
home.get('/vitau-swagger.json', (req, res) => {
  if (req.session.user && req.session.user.role !== 'client') {
    res.sendFile('vitau-swagger.json', { root: '.' });
  } else {
    res.sendStatus(404);
  }
});

home.get('/docs', async (req, res, next) => {
  if (req.session.user && req.session.user.role !== 'client') {
    next();
  } else {
    res.render('home', { user: req.session.user });
  }
});

home.get(
  '/docs',
  redoc({
    title: 'API Docs',
    specUrl: '/home/swagger.json',
  })
);

// <---Eliminar--->
home.get(
  '/vitau',
  redoc({
    title: 'API Docs',
    specUrl: '/home/vitau-swagger.json',
  })
);

home.get('/', async (req, res, next) => {
  if (req.session.user && req.session.user.role !== 'client') {
    res.redirect('/home/docs');
  } else {
    res.render('home', { user: req.session.user });
  }
});

// <---Eliminar--->
home.get('/vitau', async (req, res, next) => {
  if (req.session.user && req.session.user.role !== 'client') {
    res.redirect('/home/vitau');
  } else {
    res.render('home', { user: req.session.user });
  }
});

export default home;
