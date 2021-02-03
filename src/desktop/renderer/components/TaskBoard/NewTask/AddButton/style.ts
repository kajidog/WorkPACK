import styled from 'styled-components'
import { flexCenter } from '../../../../styles'
export const mainStyle = styled.div`
    position: fixed;
    top: 140px;
    right: 0;
    button {
        font-size: .7rem;
        ${flexCenter}
        background-color: #ffd3b6;
        color: #221; 
        transition: .4s;
        border: none;
        border-radius: 1rem 0 0 1rem;
        outline: none;
        border: 1px solid #00000000;
        box-shadow: 5px 5px 10px #00000055;
        padding: 1.2rem;
        width: 6rem;
        height: 4rem;
        cursor: pointer;
        :hover, :active{
            filter: brightness(95%);
           background-color: #000;
           color: #ffd3b6; 
        }
        :focus{
            filter: brightness(110%);
        }
    }
`

export default mainStyle