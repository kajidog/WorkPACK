import { useSelector } from "react-redux";
import { userState } from ".";

export const useUserState = () => {
  return useSelector((state: { user: userState }) => state.user);
};
