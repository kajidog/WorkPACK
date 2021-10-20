// タスクボード

import React from "react";
import { useDispatch } from "react-redux";
import { ipcRenderer } from "electron";
import styled, { css } from "styled-components";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";

import { Work } from "../../store/classroom";
import Task from "./Board";
import Add from "./NewTask";
import { flexCenter } from "../../styles";
import { getTime } from "../Classroom/CourseWork/assets"
import { useToggle } from "../../store/tasks/selector";
import slice from "../../store/tasks";


type Props = {
    work: Work;
    onClose?: () => void;
};

const Component: React.FC<Props> = (props) => {

    const ref = React.useRef<HTMLDivElement | null>(null);  // 提出ページに使用
    const [state, setState] = React.useState({
        addToggle: false,   // タスク追加画面のトグル
    });
    const dispatch = useDispatch();
    const { googleToggle } = useToggle();   // 提出ページのトグル

    // // 提出ページのトグルを変更
    const handleChangeToggle = () => {
        dispatch(slice.actions.setToggle(!googleToggle))
    }

    // どこに表示していいかを取得するためだけに使用
    const Page = (
        <div className="googlepage" ref={ref} >
        </div>
    )

    // 課題ページを読み込んでおく
    React.useEffect(() => {
        const message = ipcRenderer.sendSync("create_classroom_work", props.work.alternateLink)
        if (message) {
            ipcRenderer.send("set_classroom_work", { height: 500, width: 500, x: -5000, y: 50 })
        }
        return () => {
            ipcRenderer.send("close_classroom_work", props.work.alternateLink)
        }
    }, [])

    // タスク追加画面の表示切り替え
    const handleAddChange = () => {

        // 開くときに提出ページが開いていたら提出ページを閉じる
        if (!state.addToggle) {
            googleToggle && handleChangeToggle()
        }
        setState({ ...state, addToggle: !state.addToggle })
        dispatch(slice.actions.setToggle(false))
    }

    // 提出ページのトグルを切り替えるときに切り替えた位置を取得
    React.useEffect(() => {
        if (ref.current) {
            const x = ref.current.offsetLeft
            const y = ref.current.offsetTop
            const height = ref.current.offsetHeight
            const width = ref.current.offsetWidth
            const position = { x, y, height, width }

            // 提出ページの位置を合わせる
            ipcRenderer.send("set_classroom_work", googleToggle ? position : { height, width, x: -5000, y: 50 })
        }
    }, [googleToggle])

    return (
        <Style googleToggle={googleToggle} >
            <header>
                <button onClick={props.onClose}>
                    <KeyboardBackspaceIcon />
                </button>
                <div>{props.work.title}</div>
                <div>提出期限 {getTime(props.work)}</div>
            </header>
            <Task workId={props.work.courseWorkId} />
            <Add workId={props.work.courseWorkId} toggle={state.addToggle} onChange={handleAddChange} />
            <div className="googlepage_button"><button onClick={handleChangeToggle} >{googleToggle ? "閉じる" : "提出ページ"}</button></div>
            {Page}
        </Style>
    );
};

const Style = styled.div<{ googleToggle: boolean }>`
${props => css`
  .googlepage_button {
    transition: .2s;
    position: fixed;
    top: 68px;
    right: 0;
    transform:  translate(${props.googleToggle ? "-500px" : "0"});
    &>button{
        background-color: #ffd3b6;
        border: none;
        padding: 1.2rem;
        border-radius: 1rem 0 0 1rem;
        color: #222;
        outline: none;
        cursor: pointer;
        padding: 1.2rem;
        width: 6rem;
        height: 4rem;
        font-size: .7rem;
        transition: .4s;
        :hover, :active{
            filter: brightness(95%);
           background-color: #000;
           color: #ffd3b6; 
        }
        :focus{
            filter: brightness(105%);
        }
    }
  }
  .googlepage{
        position: fixed;
        top: 66px;
        right: 5px;
        width: 500px;
        bottom: 6rem;
        background-color: inherit;
        transform:  translate(${props.googleToggle ? "0" : "550px"});
        box-shadow: 3px 3px 10px #00000077;
    }
    header {
        color: #ffd3b6;
        position: fixed;
        display: flex;
        justify-content: flex-start;
        top: 0;
        left: 0;
        height: 3.8rem;
        background-color: #222;
        width: 100vw;
        & > div {
        font-weight: bolder;
        font-size: 1rem;
        }
        & > * {
        margin: 0 0.5rem;
        }
        button {
            ${flexCenter}
            transition: .3s;
            border: none;
            cursor: pointer;
            color: inherit;
            background-color: inherit;
            padding: .25rem .5rem;
            border-radius: .5rem;
            &:hover{
                color: #000;
                background-color: #ffd3b6;
            }
        }
    }
    position: fixed;
    background-color: #fff;
    top: 0;
    left: 0;
    bottom:0;
    padding-top: 3.8rem;
    overflow: scroll;
    height: 100vh;
    width: 100vw;
    z-index: 999;
`}
`;

export default Component;
