import React from "react";
import Style from "./style";
import { useCourses } from "../../../store/classroom/selector";
import { useUserState } from "../../../store/user/selector";
import { useDispatch } from "react-redux";
import { mapCourses, getCourses } from "./assets";
import { ipcRenderer } from "electron";
import slice from "../../../store/classroom";

export type Props = {};

const Component: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const redux = useCourses();
  const { auth, login } = useUserState();
  React.useEffect(() => {
    function get(event: any, msg: any) {
      console.log(event.type);
      dispatch(slice.actions.setCurses(msg));
      dispatch(slice.actions.setLoading({ state: false, message: "" }));
    }
    function bad_get() {
      dispatch(slice.actions.setLoading({ state: false, message: "" }));
    }
    ipcRenderer.on("get_courses", get);
    ipcRenderer.on("get_courses_failed", bad_get);
    return () => {
      ipcRenderer.removeListener("get_courses", get);
      ipcRenderer.removeListener("get_courses_failed", bad_get);
    };
  }, []);

  React.useEffect(() => {
    login && auth && getCourses(dispatch, auth);
  }, [auth]);
  return <Style>{mapCourses(redux.courses)}</Style>;
};

export default Component;
