import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ipcRenderer } from "electron";
import { todo } from "../../components/Item/ToDo";
import { Announce, courseWorkMaterial } from "../classroom";

// タスクのサイズ
export type Size = {
  width: number;
  height: number;
};

// タスクの位置
export type Position = {
  x: number;
  y: number;
};

// タスクの状態
export type InfoOption = {
  title: string;
  hide: boolean;
};

// メモのタスク
export type MemoType = {
  type: "memo";
  word: string
  html: string
}

// アナウンスのタスク
export type AnnounceType = {
  type: "announce";
  announce: Announce
  html: string
}

// 課題資料のタスク
export type WorkMaterialType = {
  type: "workMaterial";
  material: courseWorkMaterial
  html: string
}

// URLのタスク
export type IframeType = {
  type: "iframe";
  url: string
}

// マークダウンのタスク
export type MarkDownType = {
  type: "markdown";
  word: string;
}

// 画像のタスク
export type ImgType = {
  type: "img";
  img: any;
}

// ToDoのタスク
export type ToDoType = {
  type: "todo",
  todo: todo
}

// カードに設定されうるタスク
export type PropsType = MemoType | AnnounceType | IframeType | MarkDownType | ToDoType | WorkMaterialType | ImgType;

// タスク
export type Task = {
  id: number;
  size: Size;
  position: Position;
  options: InfoOption;
  props: PropsType
};

// タスクス
export type Tasks = {
  [id: string]: Task[];
};

// Store
export type TasksState = {
  tasks: { [workId: string]: Task[] };
  loading: boolean;
  error: boolean;
  errorMessage: string;
  toggle: boolean
};

// 初期値
export const initialState: TasksState = {
  tasks: {},
  loading: false,
  error: false,
  errorMessage: "",
  toggle: false
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {

    // 全てのタスクをセット
    setAll: (state, action: PayloadAction<Tasks>) => {
      return { ...state, tasks: action.payload }
    },

    // タスクを更新
    setTasks: (state, action: PayloadAction<{ workId: string, tasks: Task[] }>) => {
      let next = { ...state.tasks };
      next[action.payload.workId] = action.payload.tasks;
      ipcRenderer.send("set_tasks", [action.payload.tasks, action.payload.workId])  //ストレージにも保存
      return {
        ...state,
        tasks: next,
      }
    },

    // タスクを追加
    addTask: (state, action: PayloadAction<{ workId: string, task: Task }>) => {
      let next = { ...state.tasks };
      next[action.payload.workId] = [...(next[action.payload.workId] || []), action.payload.task]
      return {
        ...state,
        tasks: next,
      }
    },

    // タスクの表示を変更
    setToggle: (state, action: PayloadAction<boolean>) => ({
      ...state,
      toggle: action.payload
    })
  }
});

export default counterSlice;
