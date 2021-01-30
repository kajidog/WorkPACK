import { WIDTH as ITEM_WIDTH, HEIGHT as ITEM_HEIGHT } from "../Item/style"

import styled, { css } from 'styled-components'

// ボードスタイルの引数
type BordProps = {
  width: number;
  height: number;
  resize?: boolean;
}

// ボードStyled
export const Board = styled.div<BordProps>`
${props => css`
    background-color: #444;
    position: relative;
    width: ${props.width * ITEM_WIDTH}px;
    height: ${props.height * ITEM_HEIGHT}px;
  ${props.resize && css`cursor: nwse-resize;`}
`}
`
