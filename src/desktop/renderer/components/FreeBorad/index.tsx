// 自由なタスクボード
import React from "react";
import styled, { } from "styled-components"
import { flexCenter } from "../../styles";
import Board from "../TaskBoard/Board"
import Add from "../TaskBoard/NewTask"

const MAX_PAGE = 5

const Component = () => {
    const [add, setAdd] = React.useState(false);
    const [page, setPage] = React.useState(0);

    // ページ切り替え処理
    const changePage = (index: number) => () => {
        if (index === -1) {
            return
        }
        if (index === MAX_PAGE) {
            return
        }
        setPage(index % MAX_PAGE)
    }

    // ページ切り替えボタン
    const changePageIndexDom = (
        <ChangeToggle>
            <div>ページ{page + 1}</div>
            <div><button onClick={changePage(page - 1)} >前へ</button><button onClick={changePage(page + 1)} >次へ</button></div>
        </ChangeToggle>
    )

    return (
        <Style >
            <Board workId={"me" + page} />
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
            font-size: .9rem;
            padding: 0;
            flex: 1 1 auto;
            ${flexCenter}
            width: 100%;
            &:first-child{
                cursor: default;
                padding: .5rem 0;
            }
            &>button{
                transition: .2s;
                cursor: pointer;
                height: 100%;
                width: 100%;
                border: none;
                border-top: 1px solid;
                outline: none;
                background-color: inherit;
                color: inherit;
                font-size: .65rem;
                padding: .5rem 0;

                &:first-child{
                border-radius: 0 0 0 .8rem;
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
        background-color: #221;
        color: #ffd3b6; 
        transition: .4s;
        border: none;
        border-radius: 1rem 0 0 1rem;
        outline: none;
        border: 2px solid #00000000;
        box-shadow: 5px 5px 10px #00000055;
        width: 7rem;
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
