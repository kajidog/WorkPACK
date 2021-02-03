import { Work } from "../../../store/classroom";
import Style from "./style";
import React from "react";
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

  const hadleClick = () => {
    setToggle(!toggle);
  };

  const TaskBoard = (
    <div className="task_wrap">
      {toggle && <Task work={work} onClose={hadleClick} />}
    </div>
  );
  return (
    <Style>
      <div className="work_card" onClick={hadleClick} >
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
