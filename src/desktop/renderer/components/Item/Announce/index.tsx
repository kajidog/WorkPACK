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

    const mapMaterials = props.announce.materials && props.announce.materials.map((material) => {
        if (material.driveFile) {
            return <li key={material.driveFile.driveFile.id}><a target="_brank" href={material.driveFile.driveFile.alternateLink} >{material.driveFile.driveFile.thumbnailUrl && <img src={material.driveFile.driveFile.thumbnailUrl} />}<span>{material.driveFile.driveFile.title}</span></a></li>
        }
        if (material.form) {
            return <li key={material.form.form.id}><a target="_brank" href={material.form.form.formUrl} ><img src={material.form.form.thumbnailUrl} /><span>{material.driveFile.driveFile.title}</span></a></li>
        }
        if (material.link) {
            return <li key={material.link.title}><a target="_brank" href={material.link.url} ><img src={material.link.thumbnailUrl} /><span>{material.link.title}</span></a></li>
        }
        return null
    })
    const Preview = (
        <div className="prevew" onDoubleClick={changeToggle} >
            {preview(props.html)}
            <ul>
                {mapMaterials}
            </ul>
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


