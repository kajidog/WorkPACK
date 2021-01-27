import { useSelector } from "react-redux";
import { TasksState } from ".";

export const useCounterState = () => {
  return useSelector((state: { counter: TasksState }) => ({
    tasks: state.counter.tasks,
  }));
};

export const useTask = (workId: string) => {
  return useSelector((state: {counter: TasksState}) => ({
    tasks: state.counter.tasks[workId] || []
  }))
}