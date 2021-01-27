import React from "react"
import {Style} from "./style"
export type Props = {
    url: string
}

const Component: React.FC<Props> = (props) => {
    return (
        <Style >
            <iframe src={props.url} frameBorder="0" width="100%" height="100%" ></iframe>
        </Style>
    )
}

export default Component


