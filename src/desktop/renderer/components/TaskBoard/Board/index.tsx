import React from "react";
import { Board } from "./style";
import * as assets from "./assets";
import Ghost from "../Item/Ghost";

import counterSlice from "../../../store/tasks";
import { useTask } from "../../../store/tasks/selector";
import { useDispatch } from "react-redux";
import { Task, Position, Size, } from "../../../store/tasks";
import { ipcRenderer } from "electron";
type Props = {
  className?: string;
  workId: string;
};

// リサイズの引数
export type ResizeTarget = {
  size: Size;
  id: number;
  position: Position;
  type: "full" | "right" | "bottom" | "left" | "top"
};

// メイン
const Component: React.FC<Props> = (props) => {
  const info = useTask(props.workId).tasks;
  const [beforeLength, setBeforeLength] = React.useState(-1)
  const [beforeId, setBeforeId] = React.useState("")
  const dispatch = useDispatch();
  const setInfo = (next: Task[]) => {
    dispatch(counterSlice.actions.setTasks({ workId: props.workId, tasks: next }));
  };
  const [isMoved, setMoved] = React.useState(false); // 移動中か？
  const [first, setFirst] = React.useState(false)
  const [target, setTarget] = React.useState<ResizeTarget & { orgin: Position } | null>(); // 移動中のターゲットID
  const [hover, setHover] = React.useState<null | Position>(null); // 移動中にホバーした項目
  const [bordSize, setBordSize] = React.useState<Size>(
    assets.getBordWidth(info, document.body.offsetWidth, document.body.offsetHeight)
  ); // ボードの大きさ
  const [isResize, setIsResize] = React.useState(false); // リサイズ中か？
  const [mouse, setMouse] = React.useState<Size>({
    width: 0,
    height: 0,
  }); // 確定前のサイズ
  const [movePosition, setPositon] = React.useState<Position>({
    x: 0,
    y: 0,
  }); // 確定前のサイズ

  const [resizeTarget, setResizeTarget] = React.useState<ResizeTarget>({
    size: { width: 1, height: 1 },
    id: 0,
    position: { x: 0, y: 0 },
    type: "full"
  }); // 移動前の情報

  React.useEffect(() => {
    if (info.length) {
      return
    }
    const tasks: Task[] | undefined = ipcRenderer.sendSync("get_tasks", props.workId)
    if (tasks) {
      changeInfo(tasks)
    }
  }, [props.workId])

  React.useEffect(() => {
    if (info.length > beforeLength && beforeLength !== -1 && beforeId === props.workId) {
      const target = info[info.length - 1]
      setMoved(true);

      setTarget({
        size: target.size,
        id: target.id,
        position: target.position,
        type: "full",
        orgin: target.position
      });

    } else {

    }
    setBeforeId(props.workId)
    setBeforeLength(beforeId === props.workId ? info.length : -1)
  }, [info.length, props.workId])

  const changeInfo = (nextInfo: Task[]) => {
    setBordSize(assets.getBordWidth(nextInfo, document.body.offsetWidth, document.body.offsetHeight));
    setInfo(nextInfo);
  };
  // 移動スタート
  const moveStart = (target: ResizeTarget) => {
    setMoved(true);
    setFirst(true)
    setTarget({ ...target, orgin: target.position });
  };

  // 移動終了
  const moveEnd = () => {
    setMoved(false);
    if (!isMoved || !hover || first || !target) return;
    changeInfo(assets.setInfoData(target, hover, info));
    setTarget(null)
  };

  // リサイズ終了イベント
  const resizeEnd = () => {
    setIsResize(false);
    if (!resizeTarget) {
      return;
    }

    changeInfo(assets.setInfoSize(resizeTarget.id, mouse, info));
  };

  // マウスをボードから離したとき
  const handleMouseUp = () => {
    if (isResize) {
      resizeEnd();
    }
  };

  // 削除いべんと
  const deleteInfoEvent = (id: number) => {
    changeInfo(assets.deleteInfo(id, info));
  };

  // 隠すイベント
  const toggleHideInfoEvent = (id: number) => {
    changeInfo(assets.changeToggleInfo(id, info));
  };

  // ホバーしたとき（移動中）
  const onmouseover = (position: Position) => {

    if (isResize) setMouse(assets.getCardSize(position, resizeTarget));
    if (first && target) {
      setTarget({ ...target, position: position })
      setFirst(false)
      setPositon(assets.getCardPosition(position, { ...target, position: position }))
      setHover(position)
    }
    if (isMoved && target && !first) {
      setHover(position)
      setPositon(assets.getCardPosition(position, target))

    };
  };

  // 升目
  const mathProps: assets.MathProps = {
    size: { width: bordSize.width, height: bordSize.height },
    onMouseOver: onmouseover,
    onMouseUp: moveEnd,
    focus: isMoved || isResize ? "true" : "false",
  };
  const changeTitle = (id: number, title: string) => {
    setInfo(assets.changeTitle(id, title, info))
  
  }
  return (
    <Board {...bordSize} onMouseUp={handleMouseUp} resize={isResize ? resizeTarget.type : undefined}>
      {assets.MathP(mathProps)}
      {info &&
        assets.mapInfo(info, {
          moveStart: moveStart,
          changeTitle: changeTitle,
          onClose: deleteInfoEvent,
          onHide: toggleHideInfoEvent,
          onResizeStart: (target) => {
            setResizeTarget(target);
            setIsResize(true);
          }
        }, changeInfo)}
      {isResize && <Ghost position={resizeTarget.position} size={mouse} />}
      {isMoved && target && !first && <Ghost position={movePosition} size={target.size} />}
    </Board>
  );
};

export default Component;
