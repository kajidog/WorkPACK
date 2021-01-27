import React from "react";
import Style from "./style";
import Header, { HeaderButton } from "./Header";
import { ResizeTarget } from "../Board";
import UnfoldMoreIcon from "@material-ui/icons/UnfoldMore";
import { Size, Position, InfoOption } from "../../../store/tasks";

export type Props = {
  id: string;
  position: Position;
  size: Size;
  options: InfoOption;
  classNmae?: string;
  moveStart: (id: string) => void;
  onClose: (id: string) => void;
  onHide: (id: string) => void;
  onResizeStart: (target: ResizeTarget) => void;
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
  const Start = () => {
    moveStart(id);
  };
  const startResize = () => {
    onResizeStart({ size, id, position });
  };
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

  return (
    <Style
      hide={props.options.hide}
      size={props.size}
      position={props.position}
    >
      <div>
        <div className="wrap_item_header" onMouseDown={Start}>
          <Header
            title={props.options?.title}
            buttonClicked={handleHeaderClick}
          />
        </div>
        <div className="item_body">{props.children}</div>
        <button onMouseDown={startResize} className="resize_button">
          <UnfoldMoreIcon color="inherit" fontSize="inherit" />
        </button>
      </div>
    </Style>
  );
};

export default Component;
