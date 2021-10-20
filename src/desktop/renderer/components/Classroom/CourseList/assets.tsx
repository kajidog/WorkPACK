import { Curse } from "../../../store/classroom";
import CourseDom from "../Course";
import slice from "../../../store/classroom";
import { ipcRenderer } from "electron";

// コースをリストで表示 
export const mapCourses = (curses: Curse[]) =>
  curses.map((course) => (
    <CourseDom key={course.id} courseId={course.id} course={course} />
  ));

// コース情報を取得
export const getCourses = (dispatch: any, auth: any) => {
  dispatch(
    slice.actions.setLoading({
      state: true,
      message: "コース一覧を取得中",
    })
  );
  ipcRenderer.send("get_courses", [auth]);
};
