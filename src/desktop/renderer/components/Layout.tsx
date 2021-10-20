// 全てに共通のレイアウト
import React, { ReactNode } from "react";
import Head from "next/head";
import styled from "styled-components";
import Login from "../components/Login";

type Props = {
  children: ReactNode;
  title?: string;
};

const Layout: React.FC<Props> = ({ children, title = "WorkPACK" }) => (
  <Style>
    <Head>
      <title>{title}</title>
    </Head>
    <header>
      <Login />
    </header>
    {children}
  </Style>
);

const Style = styled.div`
  white-space: pre-wrap;
  header {
    position: fixed;
    height: 4rem;
    top: 0;
    right: 0;
    width: 5rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    z-index: 1;
  }
  padding: 1rem 0;
  background-color: #222;
  min-height: 100vh;
  *::-webkit-scrollbar {  /* Chrome, Safari 対応 */
        display:none;
    }
`;

export default Layout;
