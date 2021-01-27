import React from "react"
import {Style} from "./style"
export type Props = {
    onChange: (word: string) => void;
    word: string
}

const Component: React.FC<Props> = (props) => {
    const handleChange = (event: any) => {
        props.onChange(event.target.value)
    }
    return (
        <Style onChange={handleChange} value={props.word} >

        </Style>
    )
}

export default Component


