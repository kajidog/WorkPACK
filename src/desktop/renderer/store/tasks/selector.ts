import { useSelector } from "react-redux";
import { TasksState } from ".";

export const useCounterState = () => {
  return useSelector((state: { counter: TasksState }) => ({
    tasks: state.counter.tasks,
  }));
};

// タスク取得
export const useTask = (workId: string) => {
  return useSelector((state: { counter: TasksState }) => {
    return {
      tasks: state.counter.tasks[workId] || []
    }
  })
}

// 表示情報
export const useToggle = () => {
  return useSelector((state: { counter: TasksState }) => ({
    googleToggle: state.counter.toggle,
  }));
}