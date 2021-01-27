import styled, { css } from "styled-components";

export const Item = styled.div<{ changeToggle: boolean }>`
  ${(props) => css`
    .user_info {
      ${props.changeToggle &&
      css`
        transform: none;
      `}
      position: relative;
      .card {
        transition: 0.5s;
        transform: translateX(${props.changeToggle ? "0" : "30rem"});
        position: absolute;
        top: 0;
        right: 1rem;
        background-color: #fff;
        padding: 0.75rem;
        border-radius: 0.5rem;
        box-shadow: 2px 2px 5px #44444422;
      }
      .info {
        display: flex;
        align-items: center;
      }

      .left,
      .right {
        padding-left: 0.5rem;
      }
      .change_account {
        text-decoration: underline;
        cursor: pointer;
        background-color: inherit;
        border: none;
      }
      img {
        margin-right: 0.5rem;
        border-radius: 50%;
        height: 3rem;
        width: 3rem;
      }
      & > button {
        background-color: #00000000;
        border: none;
        cursor: pointer;
      }
      .hide {
        position: fixed;
        z-index: -1;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
      }
    }
  `}
`;
export default Item;
