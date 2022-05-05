import React from "react";
import "antd/dist/antd.css";
import "./App.css";

import MainRoutes from "./routes/mainRoutes/MainRoutes";
import AuthRoutes from "./routes/authRoutes/AuthRoutes";
import { useCachedResources, useClientStore } from "./hooks";
import Providers from "./providers/Providers";
import "./utils/axiosConfig/axiosConfig";

function App() {
  const isLoadingComplete = useCachedResources();
  const { authentication, isLoading } = useClientStore();
  const isAuth = !!authentication.user;
  if (!isLoadingComplete || isLoading) {
    return <h1>Cargando...</h1>;
  } else {
    return <Providers>{isAuth ? <MainRoutes /> : <AuthRoutes />}</Providers>;
  }
}

export default App;
