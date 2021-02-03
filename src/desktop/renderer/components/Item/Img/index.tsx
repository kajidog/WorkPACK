import React from "react"
import { toBlob } from "../../../utils"
import { Style } from "./style"
export type Props = {
    id: number
    img: any
    onChange: (img: any) => void
}

const Component: React.FC<Props> = (props) => {
    const handleChangeFile = (e: any) => {
        if (e.target.value.length === 0 || e.target.files.length === 0) {
            return
        }

        const { files } = e.target;

        if (files) {
            toBlob(files[0], props.onChange)

        }
    };

    return (
        <Style htmlFor={"photo_" + props.id} >
            <img src={props.img} alt="preview" />
            <input
                id={"photo_" + props.id}
                type="file"
                name="photo"
                onChange={handleChangeFile}
            />
        </Style>
    )
}

export default Component


