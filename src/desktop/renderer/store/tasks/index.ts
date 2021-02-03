import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ipcRenderer } from "electron";
import { todo } from "../../components/Item/ToDo";
import { Announce, courseWorkMaterial } from "../classroom";

export type Size = {
  width: number;
  height: number;
};

export type Position = {
  x: number;
  y: number;
};

export type InfoOption = {
  title: string;
  hide: boolean;
};

export type MemoType = {
  type: "memo";
  word: string
  html: string

}

export type AnnounceType = {
  type: "announce";
  announce: Announce
  html: string

}

export type WorkMaterialType = {
  type: "workMaterial";
  material: courseWorkMaterial
  html: string
}

export type IframeType = {
  type: "iframe";
  url: string
}

export type MarkDownType = {
  type: "markdown";
  word: string;
}

export type ImgType = {
  type: "img";
  img: any;
}

export type ToDoType = {
  type: "todo",
  todo: todo
}

export type PropsType = MemoType | AnnounceType | IframeType | MarkDownType | ToDoType | WorkMaterialType | ImgType

export type Task = {
  id: number;
  size: Size;
  position: Position;
  options: InfoOption;
  props: PropsType
};

export type Tasks = {
  [id: string]: Task[];
};



export type TasksState = {
  tasks: { [workId: string]: Task[] };
  loading: boolean;
  error: boolean;
  errorMessage: string;
};


export const initialState: TasksState = {
  tasks: {},
  loading: false,
  error: false,
  errorMessage: "",
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setAll: (state, action: PayloadAction<Tasks>) => {
      return { ...state, tasks: action.payload }
    },
    setTasks: (state, action: PayloadAction<{ workId: string, tasks: Task[] }>) => {
      let next = { ...state.tasks };
      next[action.payload.workId] = action.payload.tasks
      ipcRenderer.send("set_tasks", [action.payload.tasks, action.payload.workId])
      return {
        ...state,
        tasks: next,
      }
    },
    addTask: (state, action: PayloadAction<{ workId: string, task: Task }>) => {
      let next = { ...state.tasks };
      next[action.payload.workId] = [...(next[action.payload.workId] || []), action.payload.task]
      return {
        ...state,
        tasks: next,
      }
    }
  }
});

export default counterSlice;
