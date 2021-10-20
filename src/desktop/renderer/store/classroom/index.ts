import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// コース
export type Curse = {
  id: string;
  name: string;
};

// 時間
export type DueTime = {
  hours: number;
  minutes: number;
  seconds: number;
  nanos: number;
};

// 日付
export type DueDate = {
  year: number;
  month: number;
  day: number;
};

// 課題
export type Work = {
  id: string;
  title: string;
  description: string;
  dueDate: DueDate;
  dueTime: DueTime;
  courseId: string;
  courseWorkId: string;
  userId: string;
  alternateLink: string;
};

// アナウンス
export type Announce = {
  courseId: string;
  id: string;
  text: string;
  materials: any[]
  alternateLink: string;
  creationTime: string;
  updateTime: string;
  creatorUserId: string
}

// 資料
export type courseWorkMaterial = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  materials: any[];
  creationTime: string;
  alternateLink: string;
  updateTime: string;
  creatorUserId: string;
}

export type Announces = {
  [announceId: string]: Announce;
}

export type Works = {
  [courseId: string]: Work[];
};

export type courseWorkMaterials = {
  [courseId: string]: courseWorkMaterial[];
}

type Loading = {
  state: null | boolean;
  message: string;
};

// Store
export type ClassroomState = {
  curses: Curse[];
  announces: Announces
  loading: Loading;
  works: Works;
  error: boolean;
  errorMessage: string;
  courseWorkMaterials: courseWorkMaterials
};

// 初期値
export const initialState: ClassroomState = {
  curses: [],
  announces: {},
  loading: {
    state: null,
    message: "",
  },
  works: {},
  error: false,
  errorMessage: "",
  courseWorkMaterials: {},
};

const slice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<Loading>) => ({
      ...state,
      loading: action.payload,
    }),
    setCurses: (state, action: PayloadAction<Curse[]>) => ({
      ...state,
      curses: action.payload,
    }),

    // 課題セット
    setWorks: (state, action: PayloadAction<{ id: string; works: Work[] }>) => {
      let works = { ...state.works };
      let next: Work[] = []
      let emp: Work[] = []

      // 期限がないのは後ろにセット
      action.payload.works.forEach((work) => {
        work.dueDate ? next.push(work) : emp.push(work)
      })

      next = [...next, ...emp]
      works[action.payload.id] = next;
      return {
        ...state,
        works,
      };
    },

    // アナウンスセット
    setAnnounce: (state, action: PayloadAction<{ announce: Announce }>) => {
      return {
        ...state,
        announces: { ...state.announces, [action.payload.announce.id]: action.payload.announce },
      };
    },
  },
});

export default slice;
