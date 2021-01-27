import { ipcRenderer } from "electron";
import { Work } from "../../../store/classroom";
import WorkDom from "../CourseWork";

export const getWorks = (
  setLoad: (state: boolean) => void,
  courseId: string,
  auth: any
) => {
  setLoad(true);
  ipcRenderer.send("get_works", [courseId, auth]);
};

export const mapWorks = (works: Work[], courseId: string) =>
  works.map((work) => (
    <WorkDom
      key={"work_item_" + work.id}
      courseId={courseId}
      work={work}
      workId={work.id}
    />
  ));
