import fs from "fs";
import { getToken, setToken } from "../store";
import { OAuth2Client } from "google-auth-library";

export let oAuth2Client: any;

// ファイル読み込み
export function readFile(path: string) {
  return new Promise<string | false>((resolve, reject) => {
    fs.readFile(path, (error, data) => {
      if (error != null) {
        console.log("faild read file", error);
        reject(false);
        return
      }
      resolve(data + "");
    });
  });
}

// ファイル書き込み
export function writeFile(path: string, data: string) {
  return new Promise<boolean>((resolve, reject) => {
    fs.writeFile(path, data, (error) => {
      if (error != null) {
        reject(false);
      }
      resolve(true);
    });
  });
}

// リダイレクト設定
const REDIRECT_URL = "urn:ietf:wg:oauth:2.0:oob"


const SCOPES = [
  "https://www.googleapis.com/auth/classroom.announcements",
  "https://www.googleapis.com/auth/classroom.courses",
  "https://www.googleapis.com/auth/classroom.coursework.me",
  "https://www.googleapis.com/auth/classroom.coursework.students",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/classroom.coursework.me",
  "https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly"
];


// コードに書いたらダメだぞ
const CREDENTIALS = {
  "installed": {
    "client_id":
      "257581243961-lrgoi8hoigjd8hfk39f03ncvo1k2o3l9.apps.googleusercontent.com",
    "project_id": "newloco",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "UA9IDG3kQtTDrP7YRz_Jr9YP",
    "redirect_uris": [REDIRECT_URL, "http://localhost"]
  }
}

// 認証情報取得
export const getAuth = async () => {

  const { client_secret, client_id, redirect_uris } = CREDENTIALS.installed;

  oAuth2Client = new OAuth2Client(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // トークン取得
  const token: any = getToken();

  if (!token) {
    return getNewTokenURL(oAuth2Client);
  }

  // 認証情報セット
  oAuth2Client.setCredentials(token);

  return oAuth2Client;
};

// ログインチェック
export const checkLogin = () =>
  getAuth().then(result => result ? true : false);

// 新しい認証するURLを取得
export const getNewTokenURL = (auth: any) => {
  return auth.generateAuthUrl({ scope: SCOPES });;
};

// 認証コードからトークンを取得
export const setNewToken = async (code: string) => {
  return new Promise<boolean>((resolve, reject) => {
    oAuth2Client.getToken(code, (err: any, token: any) => {
      if (err) reject(err);
      if (token) {
        oAuth2Client.setCredentials(token);
        setToken(token);
        resolve(true);
        return;
      }
      resolve(false);
    });
  });
};
