import { useSelector } from "react-redux";
import { ClassroomState } from ".";

export const useCourses = () => {
  return useSelector((state: { classroom: ClassroomState }) => ({
    courses: state.classroom.curses,
    loading: state.classroom.loading,
  }));
};
export const useAnnounce = (announceId: string) => {
  return useSelector((state: { classroom: ClassroomState }) => ({
    announce: state.classroom.announces[announceId]
  }));
};
