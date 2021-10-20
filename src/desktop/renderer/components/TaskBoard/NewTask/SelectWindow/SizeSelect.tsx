import { SizeSelect } from "./style";
import React from "react";
import { Size } from "../../../../store/tasks";


export type AddSize = "6:3" | "3:4" | "5:7";

const Sizes: AddSize[] = ["3:4", "5:7", "6:3"];

export const getSize = (size: AddSize): Size => {
  switch (size) {
    case "5:7":
      return { width: 5, height: 7 };
    case "3:4":
      return { width: 3, height: 4 };
    case "6:3":
      return { width: 6, height: 3 };
    default:
      return { width: 2, height: 2 };
  }
};

export type Props = {
  onChange?: (nextSize: AddSize) => void; // 変更イベント
  select: AddSize;  // 選択中の値
};

// リサイズボタン
const Component: React.FC<Props> = (props) => {
  const { onChange, select } = props;

  const handleClick = (type: AddSize) => () => {
    onChange && onChange(type);
  };

  // ボタンを並べて表示
  const mapSizes = Sizes.map((size_name) => (
    <button
      key={"size_" + size_name}
      onClick={handleClick(size_name)}
      className={size_name === select ? "select" : ""}
    >
      {size_name}
    </button>
  ));

  return (
    <SizeSelect>
      <p>追加されるアイテムのサイズ</p>
      <div> {mapSizes}</div>
    </SizeSelect>
  );
};

export default Component;
