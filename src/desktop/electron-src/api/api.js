const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");

const SCOPES = [
  "https://www.googleapis.com/auth/classroom.courses",
  "https://www.googleapis.com/auth/classroom.courses.readonly",
  "https://www.googleapis.com/auth/classroom.coursework.me",
  "https://www.googleapis.com/auth/classroom.coursework.me.readonly",
];
// token.jsonは、ユーザーのアクセストークンと更新トークンを保存し、
// 認証フローが初めて完了したときに自動的に作成されます
const TOKEN_PATH = "token.json";

// ローカルファイルからクライアントシークレットをロード
fs.readFile("credentials.json", (err, content) => {
  if (err) {
    console.log("Error loading client secret file:", err);
    return false;
  }
  // 認証情報を使用してクライアントを承認してから、Google ClassroomAPIを呼び出し.
  authorize(JSON.parse(content), listCourses);
});

/**
 * 指定された資格情報を使用してOAuth2クライアントを作成し、指定されたコールバック関数を実行.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, paramObj) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // 以前にトークンを保存したかどうかを確認
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client, paramObj);
  });
}

/**
 * ユーザー認証の入力を求めた後、新しいトークンを取得して保存し、
 * 認証されたOAuth2クライアントで指定されたコールバックを実行.
 *
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * ユーザがアクセスできる最初からn(デフォルト32)個のコースの情報を返す.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {int} obj.reqNum 必要なコース数 デフォルトは32, 多分指定しなくていい.
 */
function listCourses(auth, obj = { reqNum: 32 }) {
  const classroom = google.classroom({ version: "v1", auth });
  classroom.courses.list(
    {
      pageSize: obj.reqNum,
    },
    (err, res) => {
      if (err) return console.error("The API returned an error: " + err);
      const courses = res.data.courses;
      if (courses && courses.length) {
        console.log("CousesInfo:", courses);
        return courses;
      } else {
        console.log("No courses found.");
        return false;
      }
    }
  );
}

/**
 * ユーザがアクセスできるコースをidで指定して返す.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {int} obj.reqNum 必要なコース数 デフォルトは32, 多分指定しなくていい.
 * @param {str} obj.courseId 指定するid.
 */
async function getCourse(auth, obj = { reqNum: 32, courseId: 0 }) {
  const classroom = google.classroom({ version: "v1", auth });
  const courseInfo = await classroom.courses.get({ id: obj.courseId });
  console.log(courseInfo);
  return courseInfo;
}

/**
 * ユーザがアクセスできる課題一覧をコースidで指定して返す.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {int} obj.reqNum 必要なコース数 デフォルトは32, 多分指定しなくていい.
 * @param {str} obj.courseId 指定するcourseId.
 */
async function getCourseWork(auth, obj = { reqNum: 32, courseId: 0 }) {
  const classroom = google.classroom({ version: "v1", auth });
  const courseInfo = await classroom.courses.courseWork.list({
    courseId: obj.courseId,
  });
  console.log(courseInfo);
  return courseInfo;
}
