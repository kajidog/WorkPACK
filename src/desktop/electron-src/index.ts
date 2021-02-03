// Native
import { join } from "path";
import { format } from "url";

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent, BrowserView } from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";
import { getAuth, getNewtokenURL, setNewToken } from "./api/login";
import { getProfile } from "./api/profile";
import { getAnnouncement, getCourse, getCourseWorkMaterials, getWorks, uploadFile } from "./api/classroom";
import { getTasks, setTasks } from "./api/store";
const AUTH_WINDOW_ID = "ADD_WINDOW";
const MAIN_WINDOW_ID = "MAIN_WINDOW";
const CLASS_ROOM_WINDOW_ID = "CLASS_ROOM_WINDOW";
const EDITOR_WINDOW_ID = "EDITOR_WINDOW_ID";
const windows: { [id: string]: BrowserWindow } = {};
const windowVies: { [id: string]: BrowserView } = {};

// Prepare the renderer once the app is ready
app.on("ready", async () => {
  await prepareNext("./renderer");
  windows[MAIN_WINDOW_ID] = new BrowserWindow({
    width: 1300,
    height: 820,
    webPreferences: {
      nodeIntegration: true,
      preload: join(__dirname, "preload.js"),
    },
    darkTheme: true,
  });

  const url = isDev
    ? "http://localhost:8000/"
    : format({
      pathname: join(__dirname, "../renderer/out/index.html"),
      protocol: "file:",
      slashes: true,
    });

  windows[MAIN_WINDOW_ID].loadURL(url);
});

// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on("message", (event: IpcMainEvent, message: any) => {
  event.sender.send("message", message);
});


// 　ログインの確認
ipcMain.on("check-login", async (event: IpcMainEvent) => {
  const auth = await getAuth();
  switch (typeof auth) {
    case "string":
      newAuth(auth)
      event.returnValue = false;
      break;
    case "boolean":
      event.returnValue = "認証できません。";
      break;
    default:
      const userInfo = await getProfile(auth)
      event.returnValue = { auth, userInfo };
  }
});


// トークンの更新
ipcMain.on("set_token", (event, args) => {
  const code = args[0];
  if (typeof code === "string") {
    setNewToken(code)
      .then(async (result) => {
        const auth = await getAuth();
        const user = await getProfile(auth)
        console.log("user", user);
        windows[MAIN_WINDOW_ID].webContents.send("update_user", { user, auth })
        console.log("success", "save_token", result);
      })
      .catch((err) => {
        console.log("failed", "save_token", err);
      });
  }
  windows[AUTH_WINDOW_ID].close();
  event.returnValue = null;
});

// ログイン画面の表示
ipcMain.on("change_token", async (event) => {
  event.returnValue = null;
  const auth = await getAuth();
  if (typeof auth === "object") {
    const url = getNewtokenURL(auth)
    console.log("url", url);
    newAuth(url)
  }
  if (typeof auth === "string") {
    newAuth(auth)
  }
});

//　クラスルームの課題提出ページの表示
ipcMain.on("create_classroom_work", (event, args) => {
  const view = new BrowserView({});
  view.webContents.loadURL(args)
  windows[MAIN_WINDOW_ID].setBrowserView(view)
  windowVies[CLASS_ROOM_WINDOW_ID] = view
  view.setBounds({ x: 2, y: 20, width: 300, height: 300 })
  event.returnValue = true
})
// 位置の変更
ipcMain.on("set_classroom_work", (event, args) => {
  windowVies[CLASS_ROOM_WINDOW_ID].setBounds({ ...args })
  event.returnValue = true
})
// 閉じる
ipcMain.on("close_classroom_work", (event) => {
  windows[MAIN_WINDOW_ID].removeBrowserView(windowVies[CLASS_ROOM_WINDOW_ID])
  event.returnValue = true
})


// 　コース情報の取得
ipcMain.on("get_courses", async (event, args) => {
  getCourse(args[0]).then((list) => {
    console.log(list);
    event.sender.send('get_courses', list);
  }).catch((err) => {
    console.log(err);
    event.sender.send('get_courses_failed', err);
  })
})

// ファイルをGoogleDriveにアップロード
ipcMain.on("upload_file", async (event, args) => {
  const auth = await getAuth()
  uploadFile(auth, args[0], args[1])
  event.returnValue = null
})

// 課題の取得
ipcMain.on("get_works", async (event, args) => {
  const auth = await getAuth()
  getWorks(args[0], auth, args[1]).then((res) => {
    if (res) {
      event.sender.send('get_works_' + args[0], res);
    } else {
      console.log("res_not");
      event.sender.send('get_works_failed_' + args[0], res);
    }
  }).catch((err) => {
    console.log(err);
    event.sender.send('get_works_failed_' + args[0], err);
  })
})

// アナウンスの取得
ipcMain.on("get_work_info", async (event, args) => {
  const auth = await getAuth()
  getAnnouncement(auth, args).then((res) => {
    if (res) {
      console.log("アナウンス", res);
      event.sender.send('get_work_info_' + args.courseId, [res.announcements, res.pageToken]);
      return
    }
    throw ""
  }).catch((err) => {
    console.log("get_work_info_failed_", err);
    event.sender.send('get_work_info_failed_' + args.courseId, err);
  })
})

// 課題情報の取得
ipcMain.on("get_course_work_materials", async (event, args) => {
  const auth = await getAuth()
  getCourseWorkMaterials(auth, args).then((res) => {
    if (res) {
      console.log("課題情報", res);
      event.sender.send('get_course_work_materials_' + args.courseId, [res.courseWorkMaterial, res.pageToken]);
      return
    }
    throw ""
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
  const subWindow = new BrowserWindow({
    parent: windows[MAIN_WINDOW_ID],
    webPreferences: {
      nodeIntegration: true,
    },
  });


  windows[AUTH_WINDOW_ID] = subWindow;
  subWindow.loadURL(url);

  // 認証画面のタイトルが変わった時。
  windows[AUTH_WINDOW_ID].on("page-title-updated", function () {
    const newTitle = windows[AUTH_WINDOW_ID].webContents.getTitle();
    console.log("title", newTitle)
    const KEY_WORD = "Success code="
    
    const start = newTitle.indexOf(KEY_WORD)
    console.log("start", start);
    
    if (start !==  -1) {
      const last = newTitle.indexOf("&scope=")
      console.log("last", last);
      
      if (last !== -1) {
        subWindow.close();
        const code = newTitle.substr(start + KEY_WORD.length, last)
        console.log("code", code);

        setNewToken(code)
          .then(async () => {
            const auth = await getAuth();
            const user = await getProfile(auth)
            console.log("user", user);
            windows[MAIN_WINDOW_ID].webContents.send("update_user", { user, auth })
          })
          .catch((err) => {
            console.log("failed", "save_token", err);
          });
      }
    }
  });
}


ipcMain.on("open_editor", (_, args) => {
  const view = new BrowserView();
  view.webContents.loadURL('file://' + __dirname + '/../index.html')
  view.webContents.openDevTools();
  windows[MAIN_WINDOW_ID].setBrowserView(view)
  windowVies[EDITOR_WINDOW_ID] = view
  view.setBounds({ x: 2, y: 20, width: 800, height: 800 })
  console.log("log", args);
})

ipcMain.on("close_editer", () => {
  windows[MAIN_WINDOW_ID].removeBrowserView(windowVies[EDITOR_WINDOW_ID])
})

ipcMain.on("get_tasks", (event, args) => {
  event.returnValue = getTasks(args)
})

ipcMain.on("set_tasks", (_, args) => {
  setTasks(args[0], args[1])
})



