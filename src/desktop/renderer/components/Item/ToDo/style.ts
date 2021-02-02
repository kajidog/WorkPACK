import styled from "styled-components"
import { flexCenter } from "../../../styles"

export const Style = styled.div`
    width: 100%;
    height: 100%;
    padding: .5rem;
    font-size: 1.2rem;
    box-sizing: border-box;
    border-radius: 0 0 .5rem .5rem ;
    overflow-y: scroll;
    .add_todo{
        form{
            color: red;
        }
    }
    ul{
        margin: 0 auto;
        width: 100%;
        padding: 0;
        li{
            margin: .2rem 0;
            padding: .2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #aaa;
            &>input{
                flex: 0 0;
            }
            &>span{
                font-size: .8rem;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                padding: .25rem .5rem;
                height: 3rem;
                flex: 1 1;
            }
            &>button{
                flex: 0 0;
            }
        }
    }
`