// コース選択画面
import Style from "./style";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { useCourses } from "../../../../store/classroom/selector";
export type Props = {
  onSubmit: (courseId: string | null) => void;
  onChange: (courseId: string) => void;
};

const Component: React.FC<Props> = (props) => {
  const { courses } = useCourses();

  // コースをクリック
  const handleClick = (id: string, add?: boolean) => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id === "me" || add) {
      props.onSubmit(id === "me" ? null : id);
      return;
    }
    props.onChange(id);
  };

  // コースをリストで表示
  const mapCourses = courses.map((item) => (
    <li key={item.id} onClick={handleClick(item.id)} >
      <div>
        {item.name}
      </div>
      <div>
        <span className="next_dep" >
          <ChevronRightIcon fontSize="inherit" color="inherit" />
        </span>
      </div>


    </li>
  ));
  return (
    <Style>
      <ul>
        <li>コース一覧</li>
        {mapCourses}
      </ul>
    </Style>
  );
};

export default Component;
