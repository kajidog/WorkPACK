// 課題表示
import React from "react";

import { Work } from "../../../store/classroom";
import Style from "./style";
import Task from "../../TaskBoard";
import { getTime } from "./assets"
export type Props = {
  workId: string;
  courseId: string;
  work: Work;
};

const Component: React.FC<Props> = (props) => {
  const [toggle, setToggle] = React.useState(false);
  const { work } = props;

  // クリックイベント
  const handleClick = () => {
    setToggle(!toggle);
  };

  // タスクボード
  const TaskBoard = toggle && (
    <div className="task_wrap">
      <Task work={work} onClose={handleClick} />
    </div>
  );

  return (
    <Style>
      <div className="work_card" onClick={handleClick} >
        <div>
          <h2>{work.title}</h2>
          <p>{work.description}</p>
        </div>
        <p className="work_limit">期限：{getTime(work)}</p>
      </div>
      {TaskBoard}
    </Style>
  );
};

export default Component;
