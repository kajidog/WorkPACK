import { useSelector } from "react-redux";
import { userState } from ".";

// ユーザー情報
export const useUserState = () => {
  return useSelector((state: { user: userState }) => state.user);
};
