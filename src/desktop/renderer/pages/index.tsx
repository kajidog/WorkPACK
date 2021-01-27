import React from "react";
import Layout from "../components/Layout";
import Board from "../components/Classroom/CourseList";
import clice from "../store/user";
import { useRouter } from "next/router";
import electron from "electron";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components"
import { flexCenter } from "../styles";
import Bord from "../components/TaskBoard/Board"
import Add from "../components/TaskBoard/NewTask"
const IndexPage = () => {
  const [toggle, setToggle] = React.useState(false)
  const router = useRouter();
  if (router.query.code) {
    router.push("/new_token?code=" + router.query.code);
    return <div></div>;
  }
  const dispatch = useDispatch();
  const handleChange= (next: boolean) => () => {
    setToggle(next)
  }
  React.useEffect(() => {
    function ado(event: any, msg: any) {
      console.log(event.type);
      if (!msg) {
        return;
      }
      if(msg.auth){
        dispatch(clice.actions.setAuth(msg.auth));     
      }
      if(msg.user){
        dispatch(clice.actions.setUser(msg.user));
      }
    }
    electron.ipcRenderer.on("update_user", ado);
    return () => {
      electron.ipcRenderer.removeListener("update_user", ado);
    };
  }, []);

  const [add, setAdd] = React.useState(false)
  const Free = (
   <div className="free_wrap">
   <Bord workId="me" />
   <Add workId="me" toggle={add} onChange={setAdd} />
   </div>
  )

  const selectButton = (
    <div className="select_group" >
      <button className="task" onClick={handleChange(false)}>未提出の課題に切り替える</button>
      <button className="free" onClick={handleChange(true)}>フリーボードに切り替える</button>
    </div>
  )
  return (
    <Layout>
      <Style toggle={toggle}>
        {toggle && Free}
        {!toggle&& <Board />}
        {selectButton}
      </Style>
    </Layout>
  );
};

const Style = styled.div<{toggle: boolean}>`
${props => css`
.free_wrap{
  position: fixed;
  top: 0;
  left: 0;
}
.select_group{
  position: fixed;
  bottom: 1rem;
  right: 0;
  display:flex;
  flex-direction: column;
  &>.task{
    transform: translateX(${props.toggle ? "0" : "6.5rem"});
  }
  &>.free{
    transform: translateX(${!props.toggle ? "0" : "6.5rem"});
  }
  &>button{
        ${flexCenter}
        margin: 5px 0;
        font-size: .7rem;
        background-color: #ffd3b6;
        color: #221; 
        transition: .4s;
        border: none;
        border-radius: 1rem 0 0 1rem;
        outline: none;
        border: 2px solid #00000000;
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
            border: 2px solid;
        }
  }
}

`}
`

export default IndexPage;