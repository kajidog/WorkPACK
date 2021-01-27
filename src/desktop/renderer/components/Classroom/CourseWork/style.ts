import styled from "styled-components";
import { flexCenter } from "../../../styles";

const Style = styled.div`
 &>*{
     height: 100%;
 }
  & .work_card {
    cursor: pointer;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 2px 2px 5px #00000033;
    position: relative;
    height: 100%;
    overflow: hidden;
    background-color: #fff;
    h2 {
      margin-top: 0;
      color: #455a64;
    }

    p {
      color: #455a64;
    }
  }

  .task_wrap {
  }

  .select_file{
      ${flexCenter}
      width: 5rem;
      height: 5rem;
      border: 1px solid;
      position: relative;
      overflow: hidden;
  }

  .work_limit {
      filter: contrast(120%);
    padding: 0.5rem;
    font-weight: bolder;
    margin-bottom: auto;
    position: absolute;
    bottom: 0rem;
    left: 0rem;
    background: linear-gradient(#ffffff44 0%, #ccccccaa 70%, #bbbbbbff 100%);
    height: 2rem;
    border-radius: 0 0 0.5rem 0.5rem;
    right: 0rem;
  }
`;
export default Style;
