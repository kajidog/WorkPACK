import styled, { css } from "styled-components";
import { flexCenter } from "../../../styles";

const Style = styled.div<{ loading: boolean | null }>`
${props => css`
ul {
    list-style: none;
  }
  .map_item {
    display: flex;
    overflow-x: scroll;
    min-height: 5rem;
    & > * {
      padding: 1rem;
      flex: 0 0 auto;
      overflow: hidden;
      width: 400px;
      height: 400px;
    }
  }

  .emp_work,
  .loading_work {
    transition: .5s;
    & > div {
      border-radius: 0.5rem;
      box-shadow: 2px 2px 5px #00000033;
      ${flexCenter}
      flex-direction: column;
      padding: 1rem;
      height: 100%;
      background-color: #fff;
      color: #455a64;
    }
  }
  .loading_work{
    width: ${props.loading ? "300px" : "0"};
    ${props.loading ? css`
        opacity: 1;
      `:
    css`
          padding: 1rem 0;
          overflow: hidden;
      `
  }
  }
`}
`;
export default Style;
