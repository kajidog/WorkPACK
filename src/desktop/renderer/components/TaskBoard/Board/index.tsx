import React from "react";
import { Board } from "./style";
import * as assets from "./assets";
import Ghost from "../Item/Ghost";

import counterSlice from "../../../store/tasks";
import { useTask } from "../../../store/tasks/selector";
import { useDispatch } from "react-redux";
import { Task, Position, Size,  } from "../../../store/tasks";
type Props = {
  className?: string;
  workId: string;
};

// リサイズの引数
export type ResizeTarget = {
  size: Size;
  id: string;
  position: Position;
};

// メイン
const Component: React.FC<Props> = (props) => {
  const info = useTask(props.workId).tasks;
  const dispatch = useDispatch();
  const setInfo = (next: Task[]) => {
    dispatch(counterSlice.actions.setTasks({workId: props.workId, tasks: next}));
  };
  const [moved, setMoved] = React.useState(false); // 移動中か？
  const [target, setTarget] = React.useState<null | string>(null); // 移動中のターゲットID
  const [hover, setHover] = React.useState<null | Position>(null); // 移動中にホバーした項目
  const [bordSize, setBordSize] = React.useState<Size>(
    assets.getBordWidth(info)
  ); // ボードの大きさ
  const [isResize, setIsResize] = React.useState(false); // リサイズ中か？
  const [mouse, setMouse] = React.useState<Size>({
    width: 0,
    height: 0,
  }); // 確定前のサイズ
  const [resizeTarget, setResizeTarget] = React.useState<ResizeTarget>({
    size: { width: 1, height: 1 },
    id: "",
    position: { x: 0, y: 0 },
  }); // 移動前の情報

  const changeInfo = (nextInfo: Task[]) => {
    setBordSize(assets.getBordWidth(nextInfo));
    setInfo(nextInfo);
  };
  // 移動スタート
  const moveStart = (id: string) => {
    setMoved(true);
    setTarget(id);
  };

  // 移動終了
  const moveEnd = () => {
    setMoved(false);
    if (!target || !hover) return;
    changeInfo(assets.setInfoData(target, hover, info));
    setTarget(null);
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
  const deleteInfoEvent = (id: string) => {
    changeInfo(assets.deleteInfo(id, info));
  };

  // 隠すイベント
  const toggleHideInfoEvent = (id: string) => {
    changeInfo(assets.changeToggleInfo(id, info));
  };

  // ホバーしたとき（移動中）
  const onmouseover = (position: Position) => {
    if (moved) setHover(position);
    if (isResize) setMouse(assets.getCardSize(position, resizeTarget.position));
  };

  // 升目
  const mathProps: assets.MathProps = {
    size: { width: bordSize.width, height: bordSize.height },
    onMouseOver: onmouseover,
    onMouseUp: moveEnd,
    focus: moved || isResize ? "true" : "false",
  };

  return (
    <Board {...bordSize} onMouseUp={handleMouseUp} resize={isResize}>
      {assets.Math(mathProps)}
      {info &&
        assets.mapInfo(info, {
          moveStart: moveStart,
          onClose: deleteInfoEvent,
          onHide: toggleHideInfoEvent,
          onResizeStart: (target) => {
            setResizeTarget(target);
            setIsResize(true);
          }
        }, changeInfo)}

      <div>
        <div>{moved && "click"}</div>
        <div>
          {moved &&
            hover !== null &&
            "target:[" + hover.x + "," + hover.y + "]"}
        </div>
      </div>
      {isResize && (
        <div>
          mouse: [{mouse.width}, {mouse.height}]
        </div>
      )}
      {isResize && <Ghost position={resizeTarget.position} size={mouse} />}
    </Board>
  );
};

export default Component;
