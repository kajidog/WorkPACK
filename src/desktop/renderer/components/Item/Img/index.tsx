import React from "react"
import { Style } from "./style"
export type Props = {
    id: number
    url: string
    onChange: (url: string) => void
}

const Component: React.FC<Props> = (props) => {
    const handleChangeFile = (e: any) => {
        if (e.target.value.length === 0 || e.target.files.length === 0) {
            return
        }

        const { files } = e.target;

        if (files) {
            props.onChange(window.URL.createObjectURL(files[0]))
        }
    };
    return (
        <Style htmlFor={"photo_" + props.id} >
            <img src={props.url} alt="preview" />
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


