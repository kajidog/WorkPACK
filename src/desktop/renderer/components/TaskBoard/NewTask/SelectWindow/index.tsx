import React from "react";
import ImageIcon from '@material-ui/icons/WallpaperOutlined';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import NoteIcon from '@material-ui/icons/ImportContactsOutlined';
import LinkIcon from '@material-ui/icons/Link';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import WorkOutlineIcon from '@material-ui/icons/WorkOutline';
import { useDispatch } from "react-redux";

import styled from "./style";
import History from "./History";
import SizeSelect, { AddSize, getSize } from "./SizeSelect";
import { getHTML, stopPropagation, toBlob } from "../../../../utils";
import counterSlice, { Task } from "../../../../store/tasks";
import { useTask } from "../../../../store/tasks/selector";
import SelectCourse from "../SelectCourse";
import SelectWork from "../SelectWork";
import { Announce, courseWorkMaterial } from "../../../../store/classroom";
import SelectClassMaterial from "../SelectClassMaterial"
import Prompt from "./prompt"

export type Props = {
  onClose: (type: string) => void;  // 閉じる時に実行
  workId: string  // 課題ID
};

type State = {
  menus: { batch: React.ReactNode, title: string }[];
  size: AddSize;
  display: "corse" | "window" | "courses" | "material";
  courseId: string;
  isAnnounce: boolean,
};

// 一番大きいID+1を取得
const getId = (tasks: Task[]) => {
  let maxId = 0
  tasks.forEach((task) => {
    task.id > maxId && (maxId = task.id)
  })
  return maxId + 1
}

const Component: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const { tasks } = useTask(props.workId) // タスク取得
  const [prompt, setPrompt] = React.useState(false) //  プロンプトを表示するかのフラグ

  const [state, setState] = React.useState<State>({
    menus: [{
      batch: <InfoIcon />,
      title: "アナウンス"
    }, {
      batch: <WorkOutlineIcon />,
      title: "授業資料"
    }, {
      batch: <NoteIcon />,
      title: "メモ"
    }, {
      batch: <LinkIcon />,
      title: "URL"
    }, {
      batch: <div></div>,
      title: "画像"
    }, {
      batch: <FormatListBulletedIcon />,
      title: "ToDo"
    }
    ],
    size: "3:4",
    display: "window",
    courseId: "",
    isAnnounce: true
  });

  // 閉じるボタンクリック
  const doClose = () => {
    props.onClose("toggle");
  };

  // 追加するサイズの変更
  const handleSizeChange = (size: AddSize) => {
    setState({ ...state, size });
  };

  // 表示するコンテンツ変更
  const handleChangeWindow = (
    display: "corse" | "window" | "courses" | "material",
    courseId: string = state.courseId,
    type: boolean = state.isAnnounce
  ) => {
    setState({ ...state, display, courseId, isAnnounce: type });
  };

  // タスク追加か画面遷移
  const addTask = (id: string) => async () => {
    switch (id) {
      case "アナウンス":
        handleChangeWindow("courses", state.courseId, true);// 画面遷移
        break;
      case "授業資料":
        handleChangeWindow("courses", state.courseId, false);// 画面遷移
        break;
      case "URL":
        handleChangePrompt() // プロンプトを表示
        break;
      case "画像":
        break;
      case "ToDo":
        dispatch(
          counterSlice.actions.addTask({
            workId: props.workId,
            task: {
              id: getId(tasks),
              size: getSize(state.size),
              position: { x: 0, y: 0 },
              options: {
                title: "ToDo",
                hide: false,
              },
              props: {
                type: "todo",
                todo: []
              }
            }
          })
        )
        doClose();
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
                word: "",
                html: ""
              }
            }
          })
        )
        doClose();
        break;
      default:
    }
  };

  // 前の画面に戻る
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

  // アナウンスのタスクを追加
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
            announce,
            html: getHTML(announce.text)
          }
        }
      })
    )
    doClose();
  }

  // 課題資料のタスク追加
  const addCourseWorkMaterial = (material: courseWorkMaterial) => {
    dispatch(
      counterSlice.actions.addTask({
        workId: props.workId,
        task: {
          id: getId(tasks),
          size: getSize(state.size),
          position: { x: 0, y: 0 },
          options: {
            title: material.title,
            hide: false,
          },
          props: {
            type: "workMaterial",
            material,
            html: getHTML(material.description)
          }
        }
      })
    )
    doClose();
  }

  // 画像選択
  const handleChangeFile = async (e: any) => {

    // 画像が選ばれていなかった場合
    if (e.target.value.length === 0 || e.target.files.length === 0) {
      return
    }

    const { files } = e.target;
    if (files) {
      // blob化
      toBlob(files[0], (blob) => {
        // 画像のタスク追加
        dispatch(
          counterSlice.actions.addTask({
            workId: props.workId,
            task: {
              id: getId(tasks),
              size: getSize(state.size),
              position: { x: 0, y: 0 },
              options: {
                title: files[0].name,
                hide: false,
              },
              props: {
                type: "img",
                img: blob
              }
            }
          })
        )
        doClose();
      })
    }
  }

  // 画像選択コンポーネント
  const selectImg = (
    <label className="select_img" htmlFor="select_img">
      {<ImageIcon />}
      <input
        id="select_img"
        type="file"
        name="photo"
        onChange={handleChangeFile}
      />
      <span>画像</span>
    </label>
  )

  // メニューリスト
  const mapMenu = state.menus.map((menu) => (
    <li key={"menu_" + menu} onClick={addTask(menu.title)}>
      {menu.title === "画像" && selectImg}
      {menu.title !== "画像" && <div>{menu.batch}<span>{menu.title}</span></div>}
    </li>
  ));

  // 表示する画面
  const displayWindow = () => {
    switch (state.display) {
      case "window":
        return <ul>{mapMenu}</ul>;
      case "courses":
        return <SelectCourse onChange={(courseId) => {
          handleChangeWindow("corse", courseId)
        }}
          onSubmit={() => {
            createTask()
          }} />;
      case "corse":
        if (state.isAnnounce) {
          return <SelectWork isAnnounce={state.isAnnounce} courseId={state.courseId} onSubmit={addAnnounce} />
        }
        return <SelectClassMaterial courseId={state.courseId} onSubmit={addCourseWorkMaterial} />
      default:
        return <ul>{mapMenu}</ul>;
    }
  };

  // iframe入力
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

  // 文字入力フォームの表示を切り替え
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
        {prompt && <Prompt title="URLを入力してください" onSubmit={addIframe} onClose={handleChangePrompt} />}
      </div>
    </div>
  );
};

export default styled(Component);
