import { History } from "./style";
import React from "react";
import UndoRoundedIcon from "@material-ui/icons/UndoRounded";
export type active = {
  undo: boolean;
  redo: boolean;
};
export type Props = {
  onUndo?: () => void;
  onRedo?: () => void;
  active: active;
};

// やり直しボタン
const Component: React.FC<Props> = (props) => {
  const { onUndo, active } = props;

  const handleUndoClick = () => {
    onUndo && onUndo();
  };

  return (
    <History>
      <button onClick={handleUndoClick} className="undo" disabled={active.undo}>
        <UndoRoundedIcon fontSize="inherit" />
      </button>
    </History>
  );
};

export default Component;
