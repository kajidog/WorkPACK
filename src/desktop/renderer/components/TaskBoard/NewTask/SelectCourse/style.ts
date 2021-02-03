import styled, { } from "styled-components"
import { flexCenter } from "../../../../styles"

const Style = styled.div`
& h1{
    text-align: center;
    margin: .5rem;
  font-size: .9rem;
}

li{
  display: flex;
  align-items: center;
  justify-content: space-between;
    transition: .2s;
  :first-child{
    pointer-events: none;
    position: sticky;
    top: 0;
  }
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

    }
  }
  .add_item:hover{
    transition: .3s;
    transform: rotate(90deg);
  }

}
`
export default Style