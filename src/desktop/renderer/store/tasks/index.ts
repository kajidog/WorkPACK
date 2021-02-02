import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todo } from "../../components/Item/ToDo";
import { Announce } from "../classroom";

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
}

export type AnnounceType = {
  type: "announce";
  announce: Announce
}

export type IframeType = {
  type: "iframe";
  url: string
}

export type MarkDownType = {
  type: "markdown";
  word: string;
}

export type ToDoType = {
  type: "todo",
  todo: todo
}

export type PropsType = MemoType | AnnounceType | IframeType | MarkDownType | ToDoType

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
