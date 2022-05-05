import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import { Layout } from '../../organisms';
import { FixtureModule, UserModule } from './components';
import { ModuleRoute } from './components/modules.type';

const MainRoutes: React.FC = () => {
  const allRoutes: ModuleRoute[] = [UserModule, FixtureModule];

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Aca mapeo el componente que se ve por defecto (usuarios) */}
        {allRoutes.length ? (
          <Route index element={allRoutes[0].component} />
        ) : null}
        {/* Aca mapeo todos los modulos */}
        {allRoutes.length
          ? allRoutes.map((moduleRoute, i) => {
              return (
                <Route key={i} path={moduleRoute.path} element={<Outlet />}>
                  <Route
                    key={`index-${i}`}
                    index
                    element={moduleRoute.component}
                  />
                  {/* Aca mapeo todos los sub modulos */}
                  {moduleRoute.subComponents && moduleRoute.subComponents.length
                    ? moduleRoute.subComponents.map((subComponentsRoute, j) => {
                        return (
                          <Route
                            key={j}
                            path={subComponentsRoute.path}
                            element={subComponentsRoute.component}
                          />
                        );
                      })
                    : null}
                </Route>
              );
            })
          : null}
        {/* Este es por si la url no coincide con nada */}
        <Route path="*" element={<p>No hay resultados para tu busqueda</p>} />
      </Route>
    </Routes>
  );
};

export default MainRoutes;
