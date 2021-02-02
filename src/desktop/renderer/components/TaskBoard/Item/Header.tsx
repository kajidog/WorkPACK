import { Header } from "./style";
import CloseIcon from "@material-ui/icons/Close";
import RemoveIcon from "@material-ui/icons/Remove";
import { stopPropagation } from "../../../utils";
import React from "react"
import BorderColorIcon from '@material-ui/icons/BorderColor';
import Canvas from "../../Canvas"
import Prompt from "../NewTask/SelectWindow/prompt"


export type HeaderButton = "close" | "up" | "hide";
export type Props = {
  title?: string;
  buttonClicked?: (type: HeaderButton) => void;
  changeTitle: (nextTitle: string) => void
};
const Component: React.FC<Props> = (props) => {
  const [prompt, setPrompt] = React.useState(false)
  const [canvasToggle, setCanvasToggle] = React.useState(false)

  const handleClick = (type: HeaderButton) => (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (props.buttonClicked) {
      props.buttonClicked(type);
    }
  };
  const changeToggle = () => {
    setCanvasToggle(!canvasToggle)
  }
  const submit = (title: string) => {
    handleChangePrompt()
    props.changeTitle(title)
  }
  const handleChangePrompt = () => {
    setPrompt(!prompt)
  }

  return (
    <Header>
      <div
        className="close button"
        onMouseDown={stopPropagation}
        onClick={handleClick("close")}
      >
        <CloseIcon fontSize="inherit" />
      </div>
      <div
        className="hide button"
        onMouseDown={stopPropagation}
        onClick={handleClick("hide")}
      >
        <RemoveIcon fontSize="inherit" />
      </div>
      <div
        className="hide button"
        onMouseDown={stopPropagation}
        onClick={changeToggle}
      >
        <BorderColorIcon fontSize="inherit" />
      </div>
      <div className="title" onMouseDown={stopPropagation} onDoubleClick={handleChangePrompt} >{props.title}</div>

      {canvasToggle && <div onMouseDown={stopPropagation} className="canvas" > <Canvas /></div>}
      {prompt && <div onMouseDown={stopPropagation} ><Prompt title="タイトルを入力" onSubmit={submit} onClose={handleChangePrompt} /></div>}

    </Header>
  );
};

export default Component;
