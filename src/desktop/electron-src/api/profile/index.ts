import { google } from "googleapis";
import { setUserInfo } from "../store/profile";

// ユーザー情報取得
export const getProfile = (oauth2Client: any) => {

  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: "v2",
  });

  return new Promise((resolve, reject) => {
    oauth2.userinfo.get(function (err, res) {
      if (err) {
        reject(err);
        return
      }
      if (!res) {
        reject("not found res")
        return
      }
      resolve(res.data)
      setUserInfo(res.data)
    });
  })
};
