import React from "react";
import Layout from "../components/Layout";
import Board from "../components/Classroom/CourseList";
import clice from "../store/user";
import electron from "electron";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components"
import { flexCenter } from "../styles";
import FreeBorad from "../components/FreeBorad"

const IndexPage = () => {
  const [toggle, setToggle] = React.useState(false)
  const dispatch = useDispatch();

  const handleChange = (next: boolean) => () => {
    setToggle(next)
  }

  React.useEffect(() => {
    function ado(_: any, msg: any) {
      if (!msg) {
        return;
      }
      if (msg.auth) {
        dispatch(clice.actions.setAuth(msg.auth));
      }
      if (msg.user) {
        dispatch(clice.actions.setUser(msg.user));
      }
    }
    electron.ipcRenderer.on("update_user", ado);
    //const tasks = electron.ipcRenderer.sendSync("get_tasks")
    //if (tasks) {
    //  dispatch(taskClice.actions.setAll(tasks))
    //}
    return () => {
      electron.ipcRenderer.removeListener("update_user", ado);
    };
  }, []);

  const selectButton = (
    <div className="select_group" >
      <button className="task" onClick={handleChange(false)}>未提出の課題に切り替える</button>
      <button className="free" onClick={handleChange(true)}>フリーボードに切り替える</button>
    </div>
  )

  return (
    <Layout>
      <Style toggle={toggle}>
        <div className="free"><FreeBorad /></div>
        <div className="board"><Board /></div>
        {selectButton}
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
  overflow:scroll;
}
&>.board{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height:100vh;
  overflow: hidden;
  overflow-y:scroll;
  transform: translateX(${!props.toggle ? "0" : "100vw"});
}

.select_group{
  position: fixed;
  bottom: 1rem;
  right: 0;
  display:flex;
  flex-direction: column;
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
