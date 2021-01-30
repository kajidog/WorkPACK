import { Work } from "../../../store/classroom";
import Style from "./style";
import React from "react";
import Task from "../../TaskBoard";
import Dropzone from "react-dropzone";
import { ipcRenderer } from "electron";
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
      <Dropzone
        onDrop={(acceptedFiles) => {
          if (!acceptedFiles[0]) {
            return
          }
          if (acceptedFiles[0].name && acceptedFiles[0].path) {
            ipcRenderer.send("upload_file", [work, { fileName: acceptedFiles[0].name, filePath: acceptedFiles[0].path }]);
          }
        }}
      >
        {({ getRootProps }) => (
          <div {...getRootProps()}>
            <div className="work_card" onClick={hadleClick}>
              <h2>{work.title}</h2>
              <p>{work.description}</p>
              <p className="work_limit">期限：{getTime(work)}</p>
            </div>
          </div>
        )}
      </Dropzone>
      {TaskBoard}
    </Style>
  );
};

export default Component;
