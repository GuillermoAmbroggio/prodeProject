import React from 'react';
import { Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { Login } from '../../screens';

interface IMainRoutesProps {
  mainPath?: string;
}

const AuthRoutes: React.FC<IMainRoutesProps> = ({ mainPath }) => {
  let navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<Outlet />}>
        <Route index element={<Login />} />
        <Route path="iniciar-sesion" element={<Login />} />
        <Route
          path="reset"
          element={<h1>ACA SERIA EL SCREEN DE recuperar pass</h1>}
        />
        <Route
          path="*"
          element={
            <main>
              <p>NO SE ENCONTRO NADA route login !!</p>
            </main>
          }
        />
      </Route>
    </Routes>
  );
};

export default AuthRoutes;
