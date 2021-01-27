import styled, {css} from "styled-components"
import {Props} from "."
import {Props as GhostProps} from "./Ghost"
import { flexCenter } from "../../../styles";

export const WIDTH = 100
export const HEIGHT = 100
const HeaderHeight = "1.75rem"

export type ItemProps =  Pick<Props, "size"| "position"> & {hide: boolean}

export const Item =  styled.div<ItemProps>`
    transition: .4s;
    overflow-x: hidden;
    button{
    display: block;
    margin: auto;
    }
    & > div{
        width: 100%;
        height: 100%;    
        border-radius: .5rem;
        box-shadow: 4px 3px 10px 2px #33333333;

    }
    &  .item_body{
        box-sizing: border-box;
        width: 100%;
        height: calc(100% - ${HeaderHeight} - 10px);
        border-radius: 0 0 .5rem  .5rem;
        background-color: #ffffff;
    }

    box-sizing: border-box;
    padding: 10px;
    position: absolute;
    ${props => css`
    top: ${HEIGHT * props.position.y}px;
    left: ${WIDTH * props.position.x}px;
    width: ${WIDTH * props.size.width}px;
    height: ${HEIGHT * props.size.height}px;
    .resize_button{
        cursor: pointer;
        ${flexCenter}
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        transform: rotate(125deg);
        border: none;
        opacity: .0;
        position: absolute;
        bottom: 0rem;
        right: 0rem; 
        outline: none;
        &:hover{
            cursor: nwse-resize;
            background-color: #fff;
            filter: brightness(130%);
            color: #000;
        }
    }
    ${props.hide && css`
        height: ${HeaderHeight};
        .item_body, .resize_button{ display: none; }
        .wrap_item_header > div{
            border-radius: .5rem !important;
        }
    `}
` }

`;
export default Item;


export const Header = styled.div`
    height: 1.75rem;
    background-color: #ffd3b6;
    border-radius: .5rem .5rem 0 0;
    display: flex;
    align-items: center;
    padding: .2rem;
    user-select: none;
    & > .button {
        height: 1rem;
        width: 1rem;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: .65rem;
        margin: 0 .25rem;
        cursor: pointer;
        &:hover{
            filter: brightness(130%);
        }

    }
    & > .close{
        background-color:#d00;

    }
    & > .hide{
        background-color:#da0;

    }
    & > .up{
        background-color:#2a0;
    }
    & > .title{
        color: #455a64;
        font-size: .7rem;
    }
`

export const GhostStyle = styled.div<GhostProps>`
    transition: .1s;
    button{
    display: block;
    margin: auto;
    }
    & > div{
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border-radius: .5rem;
    box-shadow: 4px 3px 5px 2px #33333333;
    background-color: #ffffff99;
    }
    box-sizing: border-box;
    padding: 10px;
    position: absolute;
    ${props => css`
    top: ${HEIGHT * props.position.y}px;
    left: ${WIDTH * props.position.x}px;
    width: ${WIDTH * props.size.width}px;
    height: ${HEIGHT * props.size.height}px;
    ` }

`