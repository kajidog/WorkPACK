import Style from "./style";
import { Curse } from "../../../store/classroom";
import CourseWorkList from "../CourseWorkList";
import React from "react"
export type Props = {
  course: Curse;
  courseId: string;
};

const Component: React.FC<Props> = (props) => {
  const [toggle, setToggle] = React.useState(true)
  const handleChange = (next: boolean) => {
    setToggle(next)
  }

  return (
    <Style toggle={toggle}>
      <ul>
        <li>
          <h1>{props.course.name}</h1>
        </li>
        <li>
          {props.courseId && <CourseWorkList onClose={handleChange} courseId={props.courseId} />}
        </li>
      </ul>
    </Style>
  );
};

export default Component;
