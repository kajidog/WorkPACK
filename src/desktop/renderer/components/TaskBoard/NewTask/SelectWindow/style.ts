import styled from 'styled-components'
import {Props} from '.'
import { flexCenter } from '../../../../styles'

export const mainStyle = (component: React.FC<Props>) => styled(component)`
position: fixed;
top: 0;
left: 0;
bottom: 0;
right: 0;
background-color: #00000044;
z-index: 9999;
${flexCenter}
& > div{
    background-color: #222;
    height: 90vh;
    max-height: 40rem;
    width: 50vw;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: .5rem;
}
ul{
    list-style: none;
    padding: 0;
    margin: 0;
}
li{
    transition: .3s;
    width: 100%;
    padding: 1rem;
    background-color: #fff;
    color: #000;
    cursor: pointer;
    border-bottom: 1px solid;
    &:last-child{
        border: none;
    }
    :hover{
        background-color: #555;
        color: #fff;
    }
}
.add_content{
    overflow: scroll;
    flex: 1 1 auto;
    width: 100%;
}
.add_footer, .add_header{
    flex: 0 0 3rem;
    width: 100%;
    background-color: #444;
}

.add_footer{
    border-radius: 0 0 .5rem .5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: .5rem 1rem;
}
.add_header{
    border-radius: .5rem .5rem 0 0;
    ${flexCenter}
}

`

export default  mainStyle


export const Histry = styled.div`
    display: flex;
    button{
        width: 2rem;
        height: 1.5rem;
        background-color: #444;
        border: 1px solid #ddd;
        border-left: none;
        color: #fff;
        cursor: pointer;
        ${flexCenter}
        &:disabled{
            background-color: #999;
            border-left: none;
            border: 1px solid #ddd;
            color: #aaa;
            pointer-events: none;
        }
        &:hover{
            background-color: #fff;
            color: #000
        }
        &.redo{
            border-radius: 0 .5rem .5rem 0;
        }
        &.undo{
            border-radius: .5rem 0 0 .5rem;
            border: 1px solid #ddd;

        }
    }
`

export const SizeSelect = styled.div`
    display: flex;
    align-items: center;
    p{
        margin: 0 .25rem 0 0;
        font-size: .8rem;
    }
    &>div{
        display: flex;
        align-items: center;
    }
    button{
        width: 3rem;
        height: 1.5rem;
        background-color: #444;
        border: 1px solid #ddd;
        border-left: none;
        color: #fff;
        padding: .5rem 1rem;
        cursor: pointer;
        ${flexCenter}
        &:hover{
            background-color: #fff;
            color: #000
        }
        &.select{
            background-color: #eee;
            color: #000;
        }
        &:first-child{
            border-radius: .5rem 0 0 .5rem;
            border: 1px solid #ddd;
        }
        &:last-child{
            border-radius: 0 .5rem .5rem 0;
        }
    }
`