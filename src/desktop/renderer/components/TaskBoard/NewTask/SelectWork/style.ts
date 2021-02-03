import styled, { } from "styled-components"
import { flexCenter } from "../../../../styles"

const Style = styled.div`
  white-space: pre-wrap;
  word-break:break-all;
& h1{
  margin: .5rem 0;
}
h2{
  margin: 0;
}

.search_area{
  display: flex;
  align-items: center;
  input{
    padding: .2rem .35rem;
    height: 2rem;
    border-radius: 0;
    border: 1px solid;
    outline: none;
    width: 8rem;
  }
  button{
    outline: none;
    font-size: .5rem;
    height: 2rem;
    flex: 1 1;
    background-color: #444;
    color: #ffd3b6;
    border: 1px solid #444;
    border-right: none;
    border-radius: 0;

  }
}
ul{
  display: block;
}
li{
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: .3s;

  &>div:first-child{
    display: flex;
    align-items: center;
    span{
        ${flexCenter}
        display: flex;
        align-items: center;
        margin-right: .5rem;
        border-radius: 50%;
        padding: .1rem;
    }

  }
  & .next_dep{
        transition: 1s;
    }

  &:hover{
    & .next_dep{
        display: block;
        transform: translateX(5px);
        transition: .7s;
        color: #f54;

    }
  }
  &:first-child{
      font-weight: bolder;
      position: sticky;
      cursor: default;
      top: 0;
      & input{
        pointer-events: auto;
      }
      &:hover{
        background-color: #fff;
        color: #000;
      }
    }
  .add_item:hover{
    transition: .5s;
    transform: rotate(90deg);
  }

}
`
export default Style