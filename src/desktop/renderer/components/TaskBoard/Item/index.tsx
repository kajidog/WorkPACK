// タスクメイン
import React from "react";
import Style from "./style";
import Header, { HeaderButton } from "./Header";
import { ResizeTarget } from "../Board";
import UnfoldMoreIcon from "@material-ui/icons/UnfoldMore";
import { Size, Position, InfoOption } from "../../../store/tasks";

export type Props = {
  id: number;
  position: Position; // 位置
  size: Size; // サイズ
  options: InfoOption;  // タスクの状態
  className?: string;
  moveStart: (target: ResizeTarget) => void;  // 移動開始イベント
  onClose: (id: number) => void;    // 閉じるボタンをクリック
  onHide: (id: number) => void; // 隠すボタンをクリック
  onResizeStart: (target: ResizeTarget) => void;  // リサイズ開始
  changeTitle: (id: number, nextTitle: string) => void  // タイトルの変更イベント
};

const Component: React.FC<Props> = (props) => {

  const {
    moveStart,
    onClose,
    onHide,
    onResizeStart,
    id,
    size,
    position,
  } = props;

  // 移動開始
  const Start = () => {
    moveStart({ size, id, position, type: "full" });
  };

  // リサイズイベント
  const startResize = (type: "bottom" | "right" | "full" | "left" | "top") => () => {
    onResizeStart({ size, id, position, type });
  };

  // ヘッダのイベント
  const handleHeaderClick = (type: HeaderButton) => {
    switch (type) {
      case "close":
        onClose(id);
        break;
      case "hide":
        onHide(id);
        break;
      case "up":
        onHide(id);
        break;
    }
  };
  // リサイズのボタン（見えない）
  const resizeButtons = (
    <>
      <button onMouseDown={startResize("full")} className="resize_button">
        <UnfoldMoreIcon color="inherit" fontSize="inherit" />
      </button>
      <button onMouseDown={startResize("left")} className="resize_left"></button>
      <button onMouseDown={startResize("top")} className="resize_top"></button>
      <button onMouseDown={startResize("bottom")} className="resize_bottom"></button>
      <button onMouseDown={startResize("right")} className="resize_right"></button>
    </>
  )

  // タイトル変更イベント
  const changeTitle = (title: string) => {
    props.changeTitle(id, title)
  }

  return (
    <Style
      hide={props.options.hide}
      size={props.size}
      position={props.position}
    >
      <div>
        <div className="wrap_item_header" onMouseDown={Start}>
          <Header
            changeTitle={changeTitle}
            title={props.options?.title}
            buttonClicked={handleHeaderClick}
          />
        </div>
        <div className="item_body">{props.children}</div>
      </div>

      {!props.options.hide && resizeButtons}
    </Style>
  );
};

export default Component;
