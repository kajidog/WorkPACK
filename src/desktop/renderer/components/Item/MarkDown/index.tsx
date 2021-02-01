import { ipcRenderer } from "electron"
import React, { } from "react"
import { Style } from "./style"
export type Props = {
    onChange: (word: string) => void;
    word: string;

}

const Component: React.FC<Props> = () => {
    const [toggle, setToggle] = React.useState(false)
    const handleChange = () => {
        setToggle(true)
        ipcRenderer.send("open_editor")
    }
    const close = () => {
        setToggle(false)
        ipcRenderer.send("close_editer")

    }

    return (
        <Style onDoubleClick={handleChange} >
            {toggle && <button onClick={close} >close</button>}
        </Style>
    )
}

export default Component


