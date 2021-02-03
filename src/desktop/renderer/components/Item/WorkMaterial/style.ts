import styled from "styled-components"

export const Style = styled.div`
    width: 100%;
    height: 100%;
    border: none;
    resize: none;
    outline: none;
    font-size: 1rem;
    max-width:5000px;
    max-height:5000px;
    box-sizing: border-box;
    border-radius: .5rem;
    white-space: pre-wrap;
    word-break:break-all;
    overflow-y: scroll;
    .prevew{
        padding: .5rem;
        width: 100%;
        height: 100%;
        overflow: scroll;
        display: flex;
        flex-direction: column;
        align-items: left;
        justify-content: space-between;
    }
    ul{
        margin: 0;
        padding: 0;
        list-style: none;
        display: flex;
        justify-content: center;
        li{
            flex: 1 1 100%;
            a{  
                display: flex;
                align-items: center;
                text-decoration: none;
                color: inherit;
                img{
                    flex: 0 0 3rem;
                    height: 3rem;
                    object-fit: cover;
                    border-radius: .2rem 0 0 .2rem;
                    border-right: 1px solid #aaa;

                }
                span{
                    font-size: .8rem;
                    padding: .5rem;
                }
            }
            border-radius: .2rem;
            border: 1px solid #aaa;
        }
    }

`