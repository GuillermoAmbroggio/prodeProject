import { ModuleRoute } from './modules.type';

const UserModule: ModuleRoute = {
  siderTitle: 'Usuarios',
  iconName: 'fas fa-user',
  name: 'Buscar usuarios',
  path: 'usuarios',
  component: <h1>USER</h1>,
  subComponents: [
    {
      path: 'crear',
      component: <h1>CREAR UUSARIO</h1>,
      name: 'Crear usuario',
    },
    {
      path: 'editar',
      component: <h1>Editar UUSARIO</h1>,
      name: 'Editar usuario',
    },
    {
      path: 'eliminar',
      component: <h1>eLIMINAR UUSARIO</h1>,
      name: 'Eliminar usuario',
    },
  ],
};

export default UserModule;
