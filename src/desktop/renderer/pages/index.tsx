import React from "react";
import electron from "electron";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components"

import Layout from "../components/Layout";
import Board from "../components/Classroom/CourseList";
import user from "../store/user";
import taskSlice from "../store/tasks";
import { flexCenter } from "../styles";
import FreeBoard from "../components/FreeBorad"

const IndexPage = () => {
  const [toggle, setToggle] = React.useState(false);  // フリーボードと課題一覧切り替えフラグ
  const dispatch = useDispatch();

  const handleChange = (next: boolean) => () => {
    setToggle(next)
    if (next) {
      dispatch(taskSlice.actions.setToggle(false))
    }
  }

  React.useEffect(() => {

    // ユーザー情報取得時に実行
    function ado(_: any, msg: any) {
      if (!msg) {
        return;
      }
      if (msg.auth) {
        dispatch(user.actions.setAuth(msg.auth));
      }
      if (msg.user) {
        dispatch(user.actions.setUser(msg.user));
      }
    }
    // ユーザー情報取
    electron.ipcRenderer.on("update_user", ado);
    return () => {
      electron.ipcRenderer.removeListener("update_user", ado);
    };
  }, []);

  // 切り替えボタン
  const selectButton = (
    <div className="select_group" >
      <button className="task" onClick={handleChange(false)}>未提出の課題に切り替える</button>
      <button className="free" onClick={handleChange(true)}>フリーボードに切り替える</button>
    </div>
  )

  return (
    <Layout>
      <Style toggle={toggle}>
        {selectButton}
        <div className="free"><FreeBoard /></div>
        <div className="board"><Board /></div>
      </Style>
    </Layout>
  );
};

const Style = styled.div<{ toggle: boolean }>`
${props => css`

position: fixed;
  top:0;
  left:0;
  width: 100vw;
  height:100vh;
.free_wrap{
  position: fixed;
  top: 0;
  left: 0;
}
&>.free{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height:100vh;
  transform: translateX(${props.toggle ? "0" : "100vw"});
  overflow: hidden;
}
&>.board{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height:100vh;
  overflow: hidden;
  transform: translateX(${!props.toggle ? "0" : "100vw"});
}

.select_group{
  position: fixed;
  bottom: 1rem;
  right: 0;
  display:flex;
  flex-direction: column;
  z-index: 1000;
  &>.task{
    transform: translateX(${props.toggle ? "0" : "6.5rem"});
    ${!props.toggle && css`pointer-events: none;`}
  }
  &>.free{
    transform: translateX(${!props.toggle ? "0" : "6.5rem"});
    ${props.toggle && css`pointer-events: none;`}

  }
  &>button{
        ${flexCenter}
        margin: .3rem 0;
        font-size: .7rem;
        background-color: #ffd3b6;
        color: #221; 
        transition: .4s;
        border-radius: 1rem 0 0 1rem;
        outline: none;
        border: 1px solid #00000000;
        box-shadow: 5px 5px 10px #00000055;
        padding: 1.2rem;
        width: 7rem;
        height: 4rem;
        cursor: pointer;
        :hover, :active{
            filter: brightness(95%);
           background-color: #000;
           color: #ffd3b6; 
        }
        :focus{
            filter: brightness(110%);
        }
  }
}

`}
`

export default IndexPage;
