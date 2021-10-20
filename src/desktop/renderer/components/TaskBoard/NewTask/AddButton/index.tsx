// タスクを追加する画面を表示するボタン
import Styled from "./style";
import React from "react";

export type Props = {
  onChanged: (type: "toggle", payload: { toggle: boolean }) => void;
};

const Component: React.FC<Props> = (props) => {
  const handleClick = (type: string) => () => {
    switch (type) {
      case "toggle":
        props.onChanged(type, { toggle: true });
    }
  };
  return (
    <Styled>
      <button onClick={handleClick("toggle")}>アイテム追加</button>
    </Styled>
  );
};

export default Component;
