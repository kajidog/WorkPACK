import styled from 'styled-components'
import { Props } from '.'
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
    max-height: 40rem;
    width: 90%;
    max-width: 50rem;
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
.add_content>ul{
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}
li{
    padding: 1rem;
    flex: 0 0 12rem;
    transition: .3s;
    width: 100%;
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
.add_content>ul>li{
    padding: 0rem;
    margin: 1rem;
    flex: 0 0 12rem;
    height: 12rem;
    transition: .3s;
    width: 100%;
    background-color: #fff;
    color: #000;
    cursor: pointer;
    border: none;
    border-radius: .25rem;
    div{
        height: 100%;
        ${flexCenter}
        &>*{
            margin: .2rem;
        }
    }
    :hover{
        background-color: #555;
        color: #fff;
    }
}
.add_content{
    overflow-y: scroll;
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
.select_img{
    display: block;
    width: 100%;
    height: 100%;
    cursor: pointer;
    ${flexCenter}

    &>input{
        display: none;
    }
    &>*{
            margin: .2rem;
        }
}

`

export default mainStyle


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
            border-radius: .5rem .5rem ;
        }
        &.undo{
            border-radius: .5rem .5rem;
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