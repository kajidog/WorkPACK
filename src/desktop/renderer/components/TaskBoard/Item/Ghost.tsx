import React from "react";
import { Size, Position } from "../../../store/tasks";
import { GhostStyle } from "./style";

export type Props = {
  position: Position;
  size: Size;
};

const Component: React.FC<Props> = (props) => {
  return (
    <GhostStyle {...props}>
      <div></div>
    </GhostStyle>
  );
};

export default Component;
