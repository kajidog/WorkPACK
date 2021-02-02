import React from "react"
import { Style } from "./style"
import MarkDown, { preview } from "../MarkDown"
export type Props = {
    onChange: (word: string) => void;
    word: string
    html: string
}

const Component: React.FC<Props> = (props) => {
    const [toggle, setToggle] = React.useState(false)
    const changeToggle = () => {
        setToggle(!toggle)
    }

    const Preview = (
        <div className="prevew" onDoubleClick={changeToggle} >
            {preview(props.html)}
        </div>
    )
    return (
        <Style>
            {toggle && <MarkDown onClose={changeToggle} word={props.word} onChange={props.onChange} />}
            {!toggle && Preview}
        </Style>
    )
}

export default Component


