// Native
import { join } from "path";
import { format } from "url";

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent, BrowserView } from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";
import { getAuth, getNewTokenURL, setNewToken } from "./api/login";
import { getProfile } from "./api/profile";
import { getAnnouncement, getCourse, getCourseWorkMaterials, getWorks, uploadFile } from "./api/classroom";
import { getTasks, setTasks } from "./api/store";

const AUTH_WINDOW_ID = "ADD_WINDOW";
const MAIN_WINDOW_ID = "MAIN_WINDOW";
const CLASS_ROOM_WINDOW_ID = "CLASS_ROOM_WINDOW";
const EDITOR_WINDOW_ID = "EDITOR_WINDOW_ID";
const windows: { [id: string]: BrowserWindow } = {};
const windowVies: { [id: string]: BrowserView } = {};


// Electronの起動準備OKな時に実行
app.on("ready", async () => {
  await prepareNext("./renderer");  // Next.js 起動

  // メイン画面の設定
  windows[MAIN_WINDOW_ID] = new BrowserWindow({
    width: 1300,
    height: 820,
    webPreferences: {
      nodeIntegration: true,
      preload: join(__dirname, "preload.js"),
    },
    darkTheme: true
  });

  // Next.jsを表示（本番時はビルドしたファイルを指定）
  const url = isDev
    ? "http://localhost:8000/"
    : format({
      pathname: join(__dirname, "../renderer/out/index.html"),
      protocol: "file:",
      slashes: true,
    });

  // 表示
  windows[MAIN_WINDOW_ID].loadURL(url);
});

// 全てのウィンドが閉じられた時
app.on("window-all-closed", app.quit);

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on("message", (event: IpcMainEvent, message: any) => {
  event.sender.send("message", message);
});


// ログインしているか確認
ipcMain.on("check-login", async (event: IpcMainEvent) => {
  const auth = await getAuth(); // 認証情報を取得
  switch (typeof auth) {
    case "string": // 認証画面を開く
      newAuth(auth)
      event.returnValue = false;
      break;
    case "boolean": // 認証失敗
      event.returnValue = "認証できません。";
      break;
    default:  // 認証成功　ユーザー情報を取得して返す
      const userInfo = await getProfile(auth)
      event.returnValue = { auth, userInfo };
  }
});


// 認証トークンの取得
ipcMain.on("set_token", async (event, args) => {
  const code = args[0]; // 第1引数に認証コードを指定
  if (typeof code !== "string") {
    windows[AUTH_WINDOW_ID].close();
    event.returnValue = null;
    return
  }

  // トークンを取得
  await setNewToken(code).catch((err) => {
    console.log("failed", "save_token", err);
    event.returnValue = err;
  });

  const auth = await getAuth(); // もう一度認証
  const user = await getProfile(auth) // ユーザー情報取得
  windows[MAIN_WINDOW_ID].webContents.send("update_user", { user, auth });
  windows[AUTH_WINDOW_ID].close();  // 認証画面クローズ
  event.returnValue = null;
});

// ログイン画面の表示
ipcMain.on("change_token", async (event) => {
  event.returnValue = null;

  const auth = await getAuth(); // 認証情報取得

  // 認証情報が取得できている場合
  if (typeof auth === "object") {
    const url = getNewTokenURL(auth);
    newAuth(url);
  }

  // 認証情報が取得できていない場合
  if (typeof auth === "string") {
    newAuth(auth);
  }
});

//　クラスルームの課題提出ページの表示
ipcMain.on("create_classroom_work", (event, args) => {
  const view = new BrowserView({}); // 新規画面生成
  view.webContents.loadURL(args);  //引数で提出ページのURLを指定
  windows[MAIN_WINDOW_ID].setBrowserView(view); // メイン画面の中に表示
  windowVies[CLASS_ROOM_WINDOW_ID] = view;  // 埋め込んだ画面の情報を保存しておく
  view.setBounds({ x: 2, y: 20, width: 300, height: 300 })  // 位置を指定
  event.returnValue = true
})

// クラスルームの課題提出ページの位置の変更
ipcMain.on("set_classroom_work", (event, args) => {
  windowVies[CLASS_ROOM_WINDOW_ID].setBounds({ ...args })
  event.returnValue = true
})

// クラスルームの課題提出ページを閉じる
ipcMain.on("close_classroom_work", (event) => {
  windows[MAIN_WINDOW_ID].removeBrowserView(windowVies[CLASS_ROOM_WINDOW_ID])
  event.returnValue = true
})


// 　コース情報の取得
ipcMain.on("get_courses", async (event, args) => {
  const res = await getCourse(args[0])
    .then((list) => ['get_courses', list])
    .catch((err) => ['get_courses_failed', err]);
  event.sender.send(res[0], res[1]);
})

// ファイルをGoogleDriveにアップロード
ipcMain.on("upload_file", async (event, args) => {
  const auth = await getAuth();
  uploadFile(auth, args[0], args[1]); // 引数のファイルをアップロード
  event.returnValue = null
})

// 課題の取得
ipcMain.on("get_works", async (event, args) => {
  const auth = await getAuth();

  const res = await getWorks(args[0], auth, args[1]).catch((err) => {
    console.log(err);
    event.sender.send('get_works_failed_' + args[0], err);
  })
  if (res) {
    event.sender.send('get_works_' + args[0], res);
  } else {
    event.sender.send('get_works_failed_' + args[0], res);
  }
})

// アナウンスの取得
ipcMain.on("get_work_info", async (event, args) => {
  const auth = await getAuth();

  getAnnouncement(auth, args).then((res) => {
    if (res) {
      event.sender.send('get_work_info_' + args.courseId, [res.announcements, res.pageToken]);
      return
    }
    throw "アナウンスの取得に失敗しました";
  }).catch((err) => {
    event.sender.send('get_work_info_failed_' + args.courseId, err);
  })
})

// 課題情報の取得
ipcMain.on("get_course_work_materials", async (event, args) => {
  const auth = await getAuth();

  // 引数で取得のオプションを指定
  getCourseWorkMaterials(auth, args).then((res) => {
    if (res) {
      event.sender.send('get_course_work_materials_' + args.courseId, [res.courseWorkMaterial, res.pageToken]);
      return
    }
    throw "課題情報を取得できませんでした";
  }).catch((err) => {
    console.log("get_course_work_materials_failed_", err);
    event.sender.send('get_course_work_materials_failed_' + args.courseId, err);
  })
})

//ログで確認
ipcMain.on("log", (_, args) => {
  console.log("log", args);
})

// 認証画面の表示
const newAuth = (url: string) => {

  // サブ画面生成
  const subWindow = new BrowserWindow({
    parent: windows[MAIN_WINDOW_ID],
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // 画面情報を保持しておく
  windows[AUTH_WINDOW_ID] = subWindow;

  // 認証画面を表示
  subWindow.loadURL(url);

  // 認証コードが取得できる状態かタイトルを監視
  windows[AUTH_WINDOW_ID].on("page-title-updated", function () {
    const newTitle = windows[AUTH_WINDOW_ID].webContents.getTitle();
    const KEY_WORD = "Success code="

    const start = newTitle.indexOf(KEY_WORD);
    const last = newTitle.indexOf("&scope=");

    // 開始文字と終了文字がない場合
    if (start === -1 || last === -1) {
      return
    }

    // ↓認証コードが表示された場合の処理

    // 画面閉じる
    subWindow.close();

    // 認証コード取り出し
    const code = newTitle.substr(start + KEY_WORD.length, last);

    // 認証コードからトークンを取得
    setNewToken(code)
      .then(async () => {
        const auth = await getAuth();
        const user = await getProfile(auth);
        console.log("user", user);
        windows[MAIN_WINDOW_ID].webContents.send("update_user", { user, auth });
      })
      .catch((err) => {
        console.log("failed", "save_token", err);
      });
  });
}

// よくわかんない
ipcMain.on("open_editor", (_, args) => {
  const view = new BrowserView();
  view.webContents.loadURL('file://' + __dirname + '/../index.html')
  view.webContents.openDevTools();
  windows[MAIN_WINDOW_ID].setBrowserView(view)
  windowVies[EDITOR_WINDOW_ID] = view
  view.setBounds({ x: 2, y: 20, width: 800, height: 800 })
  console.log("log", args);
})

// よくわかんない
ipcMain.on("close_editer", () => {
  windows[MAIN_WINDOW_ID].removeBrowserView(windowVies[EDITOR_WINDOW_ID])
})

// タスクを取得
ipcMain.on("get_tasks", (event, args) => {
  event.returnValue = getTasks(args)
})

// タスクを設定
ipcMain.on("set_tasks", (_, args) => {
  setTasks(args[0], args[1])
})
