import SimpleMDE from 'react-simplemde-editor';
import React, { } from "react"
import { Style } from "./style"

export const preview = (word: string) => <span dangerouslySetInnerHTML={{ __html: word }} />


export type Props = {
    onChange: (word: string) => void;
    word: string;
    onClose: () => void
}

const Component: React.FC<Props> = (props) => {
    const toolbar: any = [
        {
            name: "close",
            action: props.onClose,
            className: "fa fa-close",
            title: "close"
        },
        '|',
        'bold',
        'italic',
        'heading',
        '|',
        'quote',
        'unordered-list',
        'ordered-list',
        '|',
        'link',
        'image',
        '|',
        'preview',
        'side-by-side',
        'fullscreen',
    ]

    const handleChange = (event: string) => {
        props.onChange(event)
    }

    return (
        <Style>
            <SimpleMDE value={props.word} options={{ toolbar }} onChange={handleChange} />
        </Style>
    )
}

export default Component


