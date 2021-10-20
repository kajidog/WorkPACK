// ______________________________________________________
// loading画面

import React from "react"
import Coffee from "./coffee"
import styled, { keyframes } from "styled-components"
type Props = {
  load: boolean //true: ロード中
}

const Component: React.FC<Props> = props => {
  const { load } = props
  return (
    <Style className={`loading ${load ? "" : " end"}`}>
      <Coffee size={40} />
    </Style>
  )
}
const fadeOut = keyframes`
{
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
`
const Style = styled.div`
.loading {
  z-index: 100;
  width: 100%;
  height: 100%;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;

  position: fixed;
  display: grid;
}
.end {
  animation: ${fadeOut} 0.7s ease-out 0.5s forwards;
}
`

export default Component