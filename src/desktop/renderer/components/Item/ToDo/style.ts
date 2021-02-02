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
    .add_button{
        border: none;
        cursor: pointer;
        background-color: inherit;
        ${flexCenter}
        font-size: 1rem;
        padding: .25rem .5rem;
    }
    .add_todo{
        padding-top: 1rem;
        form{
            display: flex;
            justify-content: flex-start;
            position: relative;
            border-bottom: 1px solid;

            input{
                flex: 1 1;
                padding: .5rem;
                font-size: .78rem;
                border: none;
                outline: none;
            }

        }
    }
    ul{
        margin: 0 auto;
        width: 100%;
        padding: 0;
        li{
            margin: .2rem 0 0rem;
            padding: .1rem .1rem 0;
            display: flex;
            justify-content: center;
            align-items: center;
            border-bottom: 1px solid;
            &>input{
                flex: 0 0;
            }
            &>input:checked + span{
                text-decoration: line-through;
            }
            &>span{
                font-size: .8rem;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                padding: .25rem .5rem .1rem;
                height: 2rem;
                flex: 1 1;
            }
            &>button{
                cursor: pointer;
                flex: 0 0;
                ${flexCenter}
                border: none;
                background-color: inherit;
                border-radius: 50%;
                font-size: 1rem;
            }
        }
    }
`