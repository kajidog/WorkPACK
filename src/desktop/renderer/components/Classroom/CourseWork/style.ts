import styled from "styled-components";
import { flexCenter } from "../../../styles";

const Style = styled.div`
 &>*{
     height: 100%;
 }
  & .work_card {
    cursor: pointer;
    border-radius: 0.5rem;
    box-shadow: 2px 2px 5px #00000033;
    position: relative;
    height: 100%;
    background-color: #fff;
    div{
      padding: 1rem;
      height: 100%;
      width: 100%;
      overflow-y: scroll;
    }
    h2 {
      margin-top: 0;
      color: #455a64;
    }

    p {
      color: #455a64;
    }
  }

  .task_wrap {
    position: fixed;
    top:0;
    left:0;
    height:100vh;
    width:100vw;
    z-index:10;
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
