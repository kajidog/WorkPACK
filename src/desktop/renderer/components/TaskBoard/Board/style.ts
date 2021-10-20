// タスクボード
import { WIDTH as ITEM_WIDTH, HEIGHT as ITEM_HEIGHT } from "../Item/style"

import styled, { css } from 'styled-components'

// ボードスタイルの引数
type BoardProps = {
  width: number;
  height: number;
  resize?: "full" | "right" | "bottom" | "left" | "top";
}
const getPointer = (props: BoardProps) => {
  switch (props.resize) {
    case "full":
      return "nwse-resize"
    case "left":
    case "right":
      return "ew-resize"
    case "top":
    case "bottom":
      return "ns-resize"
    default:
      return "default"
  }
}
// ボードStyled
export const Board = styled.div<BoardProps>`
${props => css`
    background-color: #444;
    position: relative;
    width: ${props.width * ITEM_WIDTH}px;
    height: ${props.height * ITEM_HEIGHT}px;
  ${props.resize && css`cursor: ${getPointer(props)};`}
`}
`
