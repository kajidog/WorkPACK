import Style from "./style";
import React from "react";
import AddButton from "./AddButton";
import SelectWindow from "./SelectWindow";
export type Props = {
  onChange: (next: boolean) => void;
  toggle: boolean
  workId: string
};

const Component: React.FC<Props> = (props) => {

  const handleClick = () => {
    props.onChange(!props.toggle)
  }

  return (
    <Style>
      <AddButton onChanged={handleClick} />
      {props.toggle && <SelectWindow workId={props.workId} onClose={handleClick} />}
    </Style>
  );
};

export default Component;
