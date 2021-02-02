import React from "react"
import { courseWorkMaterial } from "../../../store/classroom"
import { Style } from "./style"
import MarkDown, { preview } from "../MarkDown"

export type Props = {
    material: courseWorkMaterial
    html: string
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
            <h2>{props.material.title}</h2>
            {preview(props.html)}
        </div>
    )

    return (
        <Style >

            {toggle && <MarkDown onClose={changeToggle} word={props.material.description} onChange={changeText} />}
            {!toggle && Preview}
        </Style>
    )
}

export default Component


