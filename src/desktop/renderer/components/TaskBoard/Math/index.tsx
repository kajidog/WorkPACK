import React from "react";
import styled, { css } from "styled-components";
import { Position } from "../../../store/tasks";
import { HEIGHT, WIDTH } from "../Item/style";
export type Props = {
  position: Position;
  focus?: "true" | "false";
  onMouseOver?: (position: Position) => void;
  onMouseUp?: (position: Position) => void;
};

const Component: React.FC<Props> = (props) => {
  const Hover = () => {
    props.onMouseOver && props.onMouseOver(props.position);
  };
  const End = () => {
    props.onMouseUp && props.onMouseUp(props.position);
  };
  return (
    <ItemStyle
      x={props.position.x}
      y={props.position.y}
      onMouseOver={Hover}
      onMouseUp={End}
      focus={props.focus}
    ></ItemStyle>
  );
};

const ItemStyle = styled.div<Position & Pick<Props, "focus">>`
  text-align: center;
  box-sizing: border-box;
  padding: 10px;
  position: absolute;
  border: 1px solid #33333366;

  ${(props) => css`
    top: ${HEIGHT * props.y}px;
    left: ${WIDTH * props.x}px;
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    ${props.focus === "true" &&
    css`
      z-index: 10;
    `}
    &:hover {
      ${props.focus === "true" &&
      css`
        border: 2px solid #000;
      `}
    }
  `}
`;

export default Component;
