import React from "react"
import styled from "styled-components"
import { flexCenter } from "../../../../styles"
import { stopPropagation } from "../../../../utils"

type Props = {
    onSubmit: (wrod: string) => void
    onClose: () => void
    title: string
    value?: string
}

const Component: React.FC<Props> = (props) => {
    const [word, setWord] = React.useState(props.value || "")
    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!word.length) {
            props.onClose();
        }
        props.onSubmit(word)
    }
    const handleChange = (e: any) => {
        setWord(e.target.value)
    }
    return <Style onClick={props.onClose}>
        <div onClick={stopPropagation} >
            <form onSubmit={handleSubmit} >
                <p>{props.title}</p>
                <div>               
                     <input autoFocus type="text" value={word} onChange={handleChange} />
                    <button type="submit">OK</button>
                </div>
            </form>
        </div>
    </Style>
}

const Style = styled.div`
position: fixed;
top: 0;
left: 0;
width: 100vw;
height: 100vh;
${flexCenter}
background-color: rgba(2, 2, 2, 0.5);
z-index: 5000;
&>div{
    
    border: 1px solid;
    padding: 2rem;
    background-color: #fff;
    color: #455a64;
    border-radius: .5rem;

    p{
        margin: 0 0 .5rem;
    }
    input{
        font-size: .9rem;
        outline: none;
        padding: 0 .5rem;
        height: 2rem;
        border-radius: .2rem 0 0 .2rem;
        border: 1px solid #455a64;

    }
    button{
        cursor: pointer;
        font-size: .9rem;
        height: 2rem;
        border: 1px solid #455a64;
        border-left: none;
        padding: 0 .5rem; 
        border-radius: 0 .2rem .2rem 0;
        background-color: #455a64;
        color: #fff;
    }
    form>div{
        ${flexCenter}
    }
}
`

export default Component