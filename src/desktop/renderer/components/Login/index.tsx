// ログイン
import React from "react";
import electron from "electron";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useUserState } from "../../store/user/selector";
import Style from "./style";
import userSlice, { userInfo } from "../../store/user";

export type Props = {};

const Component: React.FC<Props> = () => {
  // すたて
  const [state, setState] = React.useState({ toggle: false });

  const router = useRouter(); // ルーター
  const { user, loading, login } = useUserState();
  const dispatch = useDispatch();

  // ログインチェック
  const onClickWithIpcSync = () => {
    dispatch(userSlice.actions.setLoading({ loading: true }));

    const ipcRenderer = electron ? electron.ipcRenderer || false : false;
    if (!ipcRenderer) {
      return;
    }

    const message = ipcRenderer.sendSync("check-login");
    switch (typeof message) {
      case "string":
        alert(message);
        break;
      case "undefined":
        alert("応答がありません");
        break;
      // ユーザー情報登録
      default:
        if (message.userInfo) {
          let next: userInfo = { name: "", email: "", picture: "" };
          message.userInfo.name && (next["name"] = message.userInfo.name);
          message.userInfo.picture &&
            (next["picture"] = message.userInfo.picture);
          message.userInfo.email && (next["email"] = message.userInfo.email);
          dispatch(userSlice.actions.setUser(next));
          dispatch(userSlice.actions.setAuth(message.auth));
        }
    }
    dispatch(userSlice.actions.setLoading({ loading: false }));
  };

  // トークン取得
  const changeUser = () => {
    dispatch(userSlice.actions.setLoading({ loading: true }));
    const ipcRenderer = electron ? electron.ipcRenderer || false : false;
    if (!ipcRenderer) {
      return;
    }
    const message = ipcRenderer.sendSync("change_token");
    switch (typeof message) {
      case "string":
        alert(message);
        break;
      case "undefined":
        alert("応答がありません");
        break;
      case "boolean":
        break;
      default:
    }
    dispatch(userSlice.actions.setLoading({ loading: false }));
  };

  React.useEffect(() => {
    if (!router.query.code) {
      !login && onClickWithIpcSync();
    }
  }, []);

  // 認証中に表示
  const Authentication = (
    <div>
      <p>認証中</p>
    </div>
  );

  // 画像クリック時
  const changeToggle = (toggle: boolean) => () => {
    setState({ ...state, toggle });
  };

  // 成功時に表示
  const successDom = (
    <div className="user_info">
      <button onClick={changeToggle(true)}>
        <img src={user.picture} />
      </button>

      <div className="card">
        <div className="info">
          <div className="left">
            <img src={user.picture} />
          </div>
          <div className="right">
            <p>{user.name}</p>
            <p>{user.email}</p>
            <p>
              <button className="change_account" onClick={changeUser}>
                アカウントを切り替える
              </button>
            </p>
          </div>
        </div>
      </div>
      {state.toggle && (
        <div className="hide" onClick={changeToggle(false)}></div>
      )}
    </div>
  );

  // ログイン失敗
  const filedLoginDom = (
    <div>
      <button onClick={changeUser}>ログイン</button>
    </div>
  );

  return (
    <Style changeToggle={state.toggle}>
      {loading === null
        ? "building..."
        : loading
          ? Authentication
          : !login
            ? filedLoginDom
            : successDom}
    </Style>
  );
};

export default Component;
