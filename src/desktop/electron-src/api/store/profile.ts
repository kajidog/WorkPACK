import Store from "electron-store";

const store = new Store();
export const setToken = (user_info: any) => {
  return store.set("user_info", user_info);
};

export const getUserInfo = () => {
  try {
    return store.get("user_info");
  } catch {
    return false;
  }
};
export const setUserInfo = (userInfo: any) => {
    return store.set("user_info", userInfo)
}