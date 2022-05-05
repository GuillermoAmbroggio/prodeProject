import { useEffect, useRef, useState } from "react";
import { getUser } from "../particules/serverStore/request";
import useClientStore from "./useClientStore";

export default function useCachedResources(): boolean {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const unmounted = useRef(false);

  const { dispatch } = useClientStore();
  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync(): Promise<void> {
      try {
        //Aca podria activar un splash
        // void SplashScreen.preventAutoHideAsync();
        dispatch({ type: "LOADING", payload: true });

        // Si existe una sesion activa token
        const auth = await localStorage.getItem("auth");
        if (auth) {
          dispatch({ type: "AUTH", payload: JSON.parse(auth) });
          getUser()
            .then((user) => {
              dispatch({ type: "SET_USER", payload: user });
            })
            .catch(() => dispatch({ type: "LOGOUT" }));
        }
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        // oculto el splash
        // void SplashScreen.hideAsync();
        dispatch({ type: "LOADING", payload: false });
      }
    }
    if (!unmounted.current) {
      void loadResourcesAndDataAsync();
    }

    return () => {
      unmounted.current = true;
    };
  });

  return isLoadingComplete;
}
