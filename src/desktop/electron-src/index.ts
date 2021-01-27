// Native
import { join } from "path";
import { format } from "url";

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent, BrowserView } from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";
import { getAuth, getNewtokenURL, setNewToken } from "./api/login";
import { getProfile } from "./api/profile";
import { getAnnouncement, getCourse, getWorks, uploadFile } from "./api/classroom";
import qs from "qs"
const AUTH_WINDOW_ID = "ADD_WINDOW";
const MAIN_WINDOW_ID = "MAIN_WINDOW";
const CLASS_ROOM_WINDOW_ID = "CLASS_ROOM_WINDOW";
const windows: { [id: string]: BrowserWindow } = {};
const windowVies: { [id: string]: BrowserView } = {};

// Prepare the renderer once the app is ready
app.on("ready", async () => {
  await prepareNext("./renderer");
  windows[MAIN_WINDOW_ID] = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      preload: join(__dirname, "preload.js"),
    },
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
      event.returnValue = {auth, userInfo};
  }
});

ipcMain.on("set_token", (event, args) => {
  const code = args[0];
  if (typeof code === "string") {
    setNewToken(code)
      .then(async(result) => {
        const auth = await getAuth();
        const user = await getProfile(auth)
        console.log("user", user);
        windows[MAIN_WINDOW_ID].webContents.send("update_user", { user, auth})
        console.log("success", "save_token", result);
      })
      .catch((err) => {
        console.log("failed", "save_token", err);
      });
  }
  windows[AUTH_WINDOW_ID].close();
  event.returnValue = null;
});

ipcMain.on("change_token", async(event) => {
  event.returnValue = null;
  const auth = await getAuth();
  if(typeof auth === "object"){
  const url = getNewtokenURL(auth)
  console.log("url", url);
  newAuth(url)
  }
  
  if(typeof auth === "string"){
    newAuth(auth)
  }
});
ipcMain.on("create_classroom_work", (event, args)=>{
  const view = new BrowserView({
    
  });
  view.webContents.loadURL(args)
  windows[MAIN_WINDOW_ID].setBrowserView(view)
  windowVies[CLASS_ROOM_WINDOW_ID] = view
  view.setBounds({x: 2, y: 20, width: 300, height: 300})
  event.returnValue = true
})

ipcMain.on("set_classroom_work", (event, args)=>{
  windowVies[CLASS_ROOM_WINDOW_ID].setBounds({...args})
  event.returnValue = true
})

ipcMain.on("close_classroom_work", (event)=>{
  windows[MAIN_WINDOW_ID].removeBrowserView(windowVies[CLASS_ROOM_WINDOW_ID])
  event.returnValue = true
})


ipcMain.on("get_courses", async(event, args) => {
  
  getCourse(args[0]).then((list)=>{
    console.log(list);
        event.sender.send('get_courses', list);
  }).catch((err) => {
    console.log(err);
    event.sender.send('get_courses_failed', err);
  })
})
ipcMain.on("upload_file", async(event, args) => {
    const auth = await getAuth()
    uploadFile(auth, args[0], args[1])
    event.returnValue = null
})
ipcMain.on("get_works", async(event, args)=>{
  const auth = await getAuth()
  getWorks(args[0], auth).then((res)=>{
    if(res){
      event.sender.send('get_works_' + args[0], res);
    }else{
      console.log("res_not");
      event.sender.send('get_works_failed_' + args[0], res);
    }
  }).catch((err)=>{
    console.log(err);
    event.sender.send('get_works_failed_' + args[0], err);    
  })
})

ipcMain.on("get_work_info", async(event, args) => {
  const auth = await getAuth()
  getAnnouncement(auth, args).then((res)=>{
    if(res){
      console.log("アナウンス", res);
      
      event.sender.send('get_work_info_' + args.courseId, [res.announcements, res.pageToken]);
      return
    }
    throw ""
  }).catch((err)=>{
    console.log("get_work_info_failed_", err);
    event.sender.send('get_work_info_failed_' + args.courseId, err);    
  })

})

ipcMain.on("log", (_, args)=>{
  console.log("log", args);
})

const newAuth = (url: string) => {
  const subWindow = new BrowserWindow({
    parent: windows[MAIN_WINDOW_ID],
    webPreferences: {
      nodeIntegration: true,
    },
  });
  const getHostnameFromString = function(path: string) {
    var result = path.replace(/\\/g, '/').match(/\/\/([^/]*)/);
    if (!result) return '';
    return result[1];
};



  windows[AUTH_WINDOW_ID] = subWindow;
  subWindow.loadURL(url);
  windows[AUTH_WINDOW_ID].on("page-title-updated", function() {
    const newTitle = windows[AUTH_WINDOW_ID].webContents.getTitle();
    const url = windows[AUTH_WINDOW_ID].webContents.getURL()
    const host = getHostnameFromString(url)
    console.log("page-title-updated: title=" + newTitle)
    console.log("url",  url);
    console.log("host", host);
    if(host === "localhost:8000" || newTitle === "Approved Clicked"){
      console.log("qs", qs.parse(url));
    }
});
}

