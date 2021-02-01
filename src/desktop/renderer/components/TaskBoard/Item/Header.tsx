import { Header } from "./style";
import CloseIcon from "@material-ui/icons/Close";
import RemoveIcon from "@material-ui/icons/Remove";
import { stopPropagation } from "../../../utils";

export type HeaderButton = "close" | "up" | "hide";
export type Props = {
  title?: string;
  buttonClicked?: (type: HeaderButton) => void;
};
const Component: React.FC<Props> = (props) => {
  const handleClick = (type: HeaderButton) => (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (props.buttonClicked) {
      props.buttonClicked(type);
    }
  };
  return (
    <Header>
      <div
        className="close button"
        onMouseDown={stopPropagation}
        onClick={handleClick("close")}
      >
        <CloseIcon fontSize="inherit" />
      </div>
      <div
        className="hide button"
        onMouseDown={stopPropagation}
        onClick={handleClick("hide")}
      >
        <RemoveIcon fontSize="inherit" />
      </div>
      <div onMouseDown={stopPropagation} className="title" >{props.title}</div>
    </Header>
  );
};

export default Component;
