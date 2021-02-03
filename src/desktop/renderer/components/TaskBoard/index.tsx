import React from "react";
import { Work } from "../../store/classroom";
import Task from "./Board";
import Add from "./NewTask";
import styled, { css } from "styled-components";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { flexCenter } from "../../styles";
import { getTime } from "../Classroom/CourseWork/assets"
import { ipcRenderer } from "electron";

type Props = {
    work: Work;
    onClose?: () => void;
};

const Component: React.FC<Props> = (props) => {
    const ref = React.useRef<HTMLDivElement | null>(null)
    const [state, setState] = React.useState({
        googleToggle: false,
        addToggle: false,
    })

    const handleChangeToggle = () => {
        setState({ ...state, googleToggle: !state.googleToggle })
        if (ref.current) {
            const x = ref.current.offsetLeft
            const y = ref.current.offsetTop
            const height = ref.current.offsetHeight
            const width = ref.current.offsetWidth
            const position = { x, y, height, width }
            ipcRenderer.send("set_classroom_work", !state.googleToggle ? position : { height, width, x: -5000, y: 50 })
        }
    }
    const Page = (
        <div className="googlepage" ref={ref} >
        </div>
    )

    React.useEffect(() => {
        const message = ipcRenderer.sendSync("create_classroom_work", props.work.alternateLink)
        if (message) {
            ipcRenderer.send("set_classroom_work", { height: 500, width: 500, x: -5000, y: 50 })
        }
        return () => {
            ipcRenderer.send("close_classroom_work", props.work.alternateLink)
        }
    }, [])
    const handleAddChange = () => {
        if (!state.addToggle) {
            state.googleToggle && handleChangeToggle()

        }
        setState({ ...state, addToggle: !state.addToggle, googleToggle: false })
    }
    return (
        <Style googleToggle={state.googleToggle} >
            <header>
                <button onClick={props.onClose}>
                    <KeyboardBackspaceIcon />
                </button>
                <div>{props.work.title}</div>
                <div>提出期限 {getTime(props.work)}</div>
            </header>
            <Task workId={props.work.courseWorkId} />
            <Add workId={props.work.courseWorkId} toggle={state.addToggle} onChange={handleAddChange} />
            <div className="googlepage_button"><button onClick={handleChangeToggle} >{state.googleToggle ? "閉じる" : "提出ページ"}</button></div>
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
        bottom: 5rem;
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
    padding-top: 3.8rem;
    overflow: scroll;
    height: 100vh;
    width: 100vw;
    z-index: 999;
`}
`;

export default Component;
