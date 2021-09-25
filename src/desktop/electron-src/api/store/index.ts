import Store from "electron-store";

const store = new Store();

// トークン保存
export const setToken = (token: any) => {
  return store.set("token", token);
};

// トークン取得
export const getToken = () => {
  try {
    return store.get("token");
  } catch {
    return false;
  }
};

// トークン削除
export const deleteToken = () => {
  store.delete("token");
};

// タスク取得
export const getTasks = (workId: string) => {
  try {
    return store.get("tasks_" + workId);
  } catch {
    return {};
  }
}

// タスク保存
export const setTasks = (token: any, workId: string) => {
  return store.set("tasks_" + workId, token);
};
