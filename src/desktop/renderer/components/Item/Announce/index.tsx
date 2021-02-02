import React from "react"
import { Announce } from "../../../store/classroom"
import { Style } from "./style"
import MarkDown, { preview } from "../MarkDown"

export type Props = {
    announce: Announce
    html: string;
    onChange: (html: string) => void
}

const Component: React.FC<Props> = (props) => {
    const [toggle, setToggle] = React.useState(false)
    const changeToggle = () => {
        setToggle(!toggle)
    }

    const changeText = (next: string) => {
        props.onChange(next)
    }
    const Preview = (
        <div className="prevew" onDoubleClick={changeToggle} >
            {preview(props.html)}
        </div>
    )
    return (
        <Style >
            {toggle && <MarkDown onClose={changeToggle} word={props.announce.text} onChange={changeText} />}
            {!toggle && Preview}
        </Style>
    )
}

export default Component


