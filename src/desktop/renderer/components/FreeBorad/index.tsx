import React from "react";
import styled, { } from "styled-components"
import { flexCenter } from "../../styles";
import Bord from "../TaskBoard/Board"
import Add from "../TaskBoard/NewTask"

const MAX_PAGE = 5

const Component = () => {
  const [add, setAdd] = React.useState(false);
  const [page, setPage] = React.useState(0);
const changePage= (index:number) => () => {
    if(index === -1){
        return
    }
    if(index === MAX_PAGE){
        return
    }
    setPage(index % MAX_PAGE)
}   
    const changePageIndexDom =  (
    <ChangeToggle>
        <div>page{page+1}</div>
        <div><button onClick={changePage(page-1)} >back</button><button onClick={changePage(page+1)} >next</button></div>
        
        
    </ChangeToggle>
    )
  return (
    <Style >
      <Bord workId={"me"+ page }/>
      <Add workId={"me" + page} toggle={add} onChange={setAdd} />
      {changePageIndexDom}
    </Style>
  );
};

const ChangeToggle = styled.div`
        position: fixed;
        bottom: 10.2rem;
        right: 0;
        padding: 0;

        &>div{
            padding: 0;
            flex: 1 1 auto;
            ${flexCenter}
            width: 100%;

            &>button{
                cursor: pointer;
                height: 100%;
                width: 100%;
                border: none;
                border-top: 1px solid;
                outline: none;
                background-color: inherit;
                color: inherit;
                &:first-child{
                border-radius: 0 0 0 1rem;
                border-right: 1px solid;
                }
                &:last-child{
                    
                }
                &:hover{
                    border-color: #ffd3b6;
                    background-color: #ffd3b6;
                    color: #221;
                }
            }
        }
        ${flexCenter}
        flex-direction: column;
        margin: .3rem 0;
        font-size: .7rem;
        background-color: #221;
        color: #ffd3b6; 
        transition: .4s;
        border: none;
        border-radius: 1rem 0 0 1rem;
        outline: none;
        border: 2px solid #00000000;
        box-shadow: 5px 5px 10px #00000055;
        width: 7rem;
        height: 4rem;
        cursor: pointer;
`
const Style = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    overflow: scroll;
`

export default Component;
