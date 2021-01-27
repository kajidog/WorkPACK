import Store from "electron-store";

const store = new Store();

export const setToken = (token: any) => {
  return store.set("token", token);
};

export const getToken = () => {
  try {
    return store.get("token");
  } catch {
    return false;
  }
};

export const deleteToken = () => {
  store.delete("token");
};
