import fs from "fs";
import { google } from "googleapis";
import { getToken, setToken } from "../store";
import {OAuth2Client} from "google-auth-library"
export let oAuth2Client: any;
export function readFile(path: string) {
  return new Promise<string | false>((resolve, reject) => {
    fs.readFile(path, (error, data) => {
      if (error != null) {
        console.log("faild read file", error);

        reject(false);
      }
      resolve(data + "");
    });
  });
}

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

const REDIRECT_URL =  "http://localhost:8000/"
 

const SCOPES = [
    "https://www.googleapis.com/auth/classroom.announcements",
    "https://www.googleapis.com/auth/classroom.courses",
    "https://www.googleapis.com/auth/classroom.coursework.me",
    "https://www.googleapis.com/auth/classroom.coursework.students",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/classroom.coursework.me",
    "https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly"

];
    const CREDENTIALS = {
        "installed":{
            "client_id":
            "257581243961-lrgoi8hoigjd8hfk39f03ncvo1k2o3l9.apps.googleusercontent.com",
            "project_id":"newloco",
            "auth_uri":"https://accounts.google.com/o/oauth2/auth",
            "token_uri":"https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
            "client_secret":"UA9IDG3kQtTDrP7YRz_Jr9YP",
            "redirect_uris":[REDIRECT_URL,"http://localhost"]
        }
    }


export const getAuth = async () => {
  const credentials = CREDENTIALS;

  if (!credentials) {
    return false;
  }
  const { client_secret, client_id, redirect_uris } = CREDENTIALS.installed;
  oAuth2Client = new OAuth2Client(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  const token: any = getToken();
  if (!token) {
    return getNewtokenURL(oAuth2Client);
  }
  oAuth2Client.setCredentials(token);
  return oAuth2Client;
};
export const checkLogin = () =>
  getAuth().then(async (result) => {
    if (result) {
      return true;
    }

    return false;
  });

export const getNewtokenURL = (auth: any) => {
  return auth.generateAuthUrl({ scope: SCOPES });;
};

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

export const getClassroomList = (auth: any) => {
  const classroom = google.classroom({ version: "v1", auth });
  classroom.courses.list({}, (err, res) => {
    if (err) return console.error("The API returned an error: " + err);
    if (!res) {
      return false;
    }
    const courses = res.data.courses;
    if (courses && courses.length) {
      console.log("CousesInfo:", courses);
      return courses;
    } else {
      console.log("No courses found.");
      return false;
    }
  });
};
