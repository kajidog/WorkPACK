import styled from "styled-components";
import { flexCenter } from "../../../styles";

const Style = styled.div`
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
`;
export default Style;
