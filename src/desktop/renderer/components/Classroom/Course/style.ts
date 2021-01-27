import styled, { css } from "styled-components";

const Style = styled.div<{toggle:boolean}>`
${props => css`

h1 {
    color: #ffd3b6;
    margin-bottom: 0rem;
  }

  height: ${props.toggle ?"450px" :"0"};
  opacity: ${props.toggle?"1":"0"};
  transition: 1s;
  ${!props.toggle && css`overflow: hidden;`}
`}

`;
export default Style;
