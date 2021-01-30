import React from "react"
import { Announce } from "../../../store/classroom"
import { Style } from "./style"
export type Props = {
    announce: Announce
}

const Component: React.FC<Props> = (props) => {
    return (
        <Style >
            {props.announce.text}
        </Style>
    )
}

export default Component


