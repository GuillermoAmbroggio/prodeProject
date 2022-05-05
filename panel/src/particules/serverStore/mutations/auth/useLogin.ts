import axios from "axios";
import { useMutation, UseMutationResult } from "react-query";
import { useClientStore } from "../../../../hooks";
import { IAuth, ILogin } from "../../../../utils/types/UserTypes";
import { getUser, postLogin } from "../../request";
import useLogout from "./useLogout";

const useLogin: () => UseMutationResult<IAuth, any, ILogin, unknown> = () => {
  const { dispatch } = useClientStore();
  const { mutate } = useLogout();

  return useMutation(postLogin, {
    onSuccess: async (data) => {
      dispatch({ type: "AUTH", payload: data });
      getUser()
        .then((user) => {
          dispatch({ type: "SET_USER", payload: user });
        })
        .catch(() => mutate());
    },
  });
};

export default useLogin;
