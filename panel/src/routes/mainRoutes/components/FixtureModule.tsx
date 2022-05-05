import React from 'react';
import { ModuleRoute } from './modules.type';

const FixtureModule: ModuleRoute = {
  siderTitle: 'Fixtures',
  iconName: 'fas fa-newspaper',
  name: 'Buscar fixtures',
  path: 'fixtures',
  component: <h1>FIXTURE SCREEEN </h1>,
  subComponents: [
    {
      path: 'crear',
      component: <h1>CREAR asd</h1>,
      name: 'Crear fixture',
    },
    {
      path: 'editar',
      component: <h1>Editar asd</h1>,
      name: 'Editar fixture',
    },
    {
      path: 'eliminar',
      component: <h1>eLIMINAR asd</h1>,
      name: 'Eliminar fixture',
    },
  ],
};

export default FixtureModule;
