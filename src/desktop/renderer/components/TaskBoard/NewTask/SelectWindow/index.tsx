import React from "react";
import styled from "./style";
import History from "./History";
import SizeSelect, { AddSize, getSize } from "./SizeSelect";
import { stopPropagation } from "../../../../utils";
import counterSlice, { Task } from "../../../../store/tasks";
import { useTask } from "../../../../store/tasks/selector";
import SelectCourse from "../SelectCourse";
import SelectWork from "../SelectWork";
import { useDispatch } from "react-redux";
import { Announce } from "../../../../store/classroom";
import Prompt from "./prompt"

export type Props = {
  onClose: (type: string) => void;
  workId: string
};

type State = {
  menus: string[];
  size: AddSize;
  display: "corse" | "window" | "courses" | "material";
  courseId: string;
  isAnnounce: boolean,
};

const getId = (tasks: Task[]) => {
  const index = tasks.length - 1
  if (tasks[index]) {
    return tasks[index].id + "1"
  }
  return "1"
}

const Component: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const { tasks } = useTask(props.workId)
  const [prompt, setPrompt] = React.useState(false)

  const [state, setState] = React.useState<State>({
    menus: [
      "クラスルームアナウンス",
      "クラスルーム課題資料",
      "メモ",
      "URL",
      "画像",
      "GoogleDrive",
    ],
    size: "3:4",
    display: "window",
    courseId: "",
    isAnnounce: true
  });

  const doClose = () => {
    props.onClose("toggle");
  };

  const handleSizeChange = (size: AddSize) => {
    setState({ ...state, size });
  };

  const handleChangeWindow = (
    display: "corse" | "window" | "courses" | "material",
    courseId: string = state.courseId,
    type: boolean = state.isAnnounce
  ) => {
    setState({ ...state, display, courseId, isAnnounce: type });
  };

  const addTask = (id: string) => async () => {
    switch (id) {
      case "クラスルームアナウンス":
        handleChangeWindow("courses");
        break;
      case "クラスルーム課題資料":
        handleChangeWindow("courses", state.courseId, false);
        break;
      case "URL":
        handleChangePrompt()
        break;
      case "メモ":
        dispatch(
          counterSlice.actions.addTask({
            workId: props.workId,
            task: {
              id: getId(tasks),
              size: getSize(state.size),
              position: { x: 0, y: 0 },
              options: {
                title: "メモ",
                hide: false,
              },
              props: {
                type: "memo",
                word: ""
              }
            }
          })
        )
        doClose();
        break;
      default:
    }
  };

  const changeHistory = () => {
    switch (state.display) {
      case "courses":
        setState({ ...state, display: "window" })
        return
      case "corse":
        setState({ ...state, display: "courses" })
        return
      case "material":
        setState({ ...state, display: "window" })

    }
  }

  // タスク追加
  const createTask = () => {
    doClose();
  }

  const addAnnounce = (announce: Announce) => {
    dispatch(
      counterSlice.actions.addTask({
        workId: props.workId,
        task: {
          id: getId(tasks),
          size: getSize(state.size),
          position: { x: 0, y: 0 },
          options: {
            title: "アナウンス",
            hide: false,
          },
          props: {
            type: "announce",
            announce
          }
        }
      })
    )
    doClose();
  }

  const mapMenue = state.menus.map((menue) => (
    <li key={"menue_" + menue} onClick={addTask(menue)}>
      {menue}
    </li>
  ));

  const displayWindow = () => {
    switch (state.display) {
      case "window":
        return <ul>{mapMenue}</ul>;
      case "courses":
        return <SelectCourse onChange={(courseId) => {
          handleChangeWindow("corse", courseId)
        }}
          onSubmit={() => {
            createTask()
          }} />;
      case "corse":
        return <SelectWork isAnnunce={state.isAnnounce} courseId={state.courseId} onSubmit={addAnnounce} />
      default:
        return <ul>{mapMenue}</ul>;
    }
  };
  const addIframe = (url: string) => {
    dispatch(
      counterSlice.actions.addTask({
        workId: props.workId,
        task: {
          id: getId(tasks),
          size: getSize(state.size),
          position: { x: 0, y: 0 },
          options: {
            title: url,
            hide: false,
          },
          props: {
            type: "iframe",
            url
          }
        }
      })
    )

    doClose();

  }

  const handleChangePrompt = () => {
    setPrompt(!prompt)
  }
  return (
    <div {...props} onClick={doClose}>
      <div onClick={stopPropagation}>
        <div className="add_header">アイテム追加</div>
        <div className="add_content">{displayWindow()}</div>
        <div className="add_footer">
          <History active={{ redo: false, undo: state.display === "window" }} onUndo={changeHistory} />
          <SizeSelect select={state.size} onChange={handleSizeChange} />
        </div>
        {prompt && <Prompt onSubmit={addIframe} onClose={handleChangePrompt} />}

      </div>
    </div>
  );
};

export default styled(Component);
