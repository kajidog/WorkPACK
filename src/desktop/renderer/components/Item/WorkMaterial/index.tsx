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
        console.log(props.material.materials);

    }
    const mapMaterials = props.material.materials && props.material.materials.map((material) => {
        if (material.driveFile) {
            return <li key={material.driveFile.driveFile.id}><a target="_brank" href={material.driveFile.driveFile.alternateLink} ><img src={material.driveFile.driveFile.thumbnailUrl} /><span>{material.driveFile.driveFile.title}</span></a></li>
        }
        if (material.form) {
            return <li key={material.form.form.id}><a target="_brank" href={material.form.form.formUrl} ><img src={material.form.form.thumbnailUrl} /><span>{material.driveFile.driveFile.title}</span></a></li>
        }
        if (material.link) {
            return <li key={material.link.link.title}><a target="_brank" href={material.link.link.url} ><img src={material.link.link.thumbnailUrl} /><span>{material.link.link.title}</span></a></li>
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

            {toggle && <MarkDown onClose={changeToggle} word={props.material.description} onChange={changeText} />}
            {!toggle && Preview}
        </Style>
    )
}

export default Component


