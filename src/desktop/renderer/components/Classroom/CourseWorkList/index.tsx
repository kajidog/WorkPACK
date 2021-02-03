import Style from "./style";
import { getWorks, mapWorks } from "./assets";
import { useUserState } from "../../../store/user/selector";
import { useWorks } from "../../../store/classroom/selector";
import { ipcRenderer } from "electron";
import slice, { } from "../../../store/classroom";
import React from "react";
import Coffee1 from "./coffe";
import Coffee from "../../../svg/Coffee";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
export type Props = {
  courseId: string;
  onClose: (courseId: string) => void
};

const Component: React.FC<Props> = (props) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState<boolean | null>(null);
  const { auth } = useUserState();
  const [auth1, setAuth1] = React.useState(null);
  const { works } = useWorks(props.courseId)
  const [counter, setCounter] = React.useState(0)
  const dispatch = useDispatch()
  React.useEffect(() => {
    function get(_: any, msg: any) {
      setCounter(counter + 1)
      if (msg) {
        if (msg.works) {
          dispatch(slice.actions.setWorks({ id: props.courseId, works: [...works, ...msg.works] }))
        }
        if (!msg.length) {
          props.onClose(props.courseId)
        }
        if (msg.pageToken && counter < 6) {
          getWorks(setLoading, props.courseId, msg.pageToken)
          return
        }
      }
      setLoading(false);
    }
    function bad_get() {
      setLoading(false);
      props.onClose(props.courseId)
    }
    ipcRenderer.on("get_works_" + props.courseId, get);
    ipcRenderer.on("get_works_failed_" + props.courseId, bad_get);
    return () => {
      ipcRenderer.removeListener("get_works_" + props.courseId, get);
      ipcRenderer.removeListener("get_works_failed_" + props.courseId, bad_get);
    };
  }, []);
  React.useEffect(() => {
    if (auth1 !== auth && !router.query.code) {
      setCounter(0)
      dispatch(slice.actions.setWorks({ id: props.courseId, works: [] }))
      getWorks(setLoading, props.courseId);
      setAuth1(auth);
    }
  }, [props.courseId, auth]);
  React.useEffect(() => {
    if (loading !== null && !works.length) {
      props.onClose(props.courseId)
    }
  }, [works])
  const liadingDom = (
    <div className="loading_work">
      <div>
        <Coffee1 size={40} />
        loading...
        </div>
    </div>
  );

  const empWork = (
    <div className="emp_work">
      <div>
        <Coffee size={200} />
        <br />
        <div>課題はありません</div>
      </div>
    </div>
  );

  return (
    <Style loading={loading} >
      <div className="map_item">
        {mapWorks(works, props.courseId)}
        {liadingDom}
        {!loading && !works.length && empWork}
      </div>
    </Style>
  );
};

export default Component;
