// 課題をリスト表示
import React from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

import Style from "./style";
import { getWorks, mapWorks } from "./assets";
import { useUserState } from "../../../store/user/selector";
import { useWorks } from "../../../store/classroom/selector";
import { ipcRenderer } from "electron";
import slice, { Work } from "../../../store/classroom";
import Coffee1 from "./coffee";
import Coffee from "../../../svg/Coffee";

export type Props = {
  courseId: string;
  onClose: (next: boolean) => void
};

const Component: React.FC<Props> = (props) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState<boolean | null>(null);
  const { auth } = useUserState();
  const [auth1, setAuth1] = React.useState(null);
  const { works } = useWorks(props.courseId);
  const [counter, setCounter] = React.useState(0);
  const dispatch = useDispatch();

  React.useEffect(() => {
    let works: Work[] = [];

    // 課題取得
    function get(_: any, msg: any) {
      setCounter(counter + 1)
      if (msg) {
        if (msg.works) {
          works = [...works, ...msg.works]
          dispatch(slice.actions.setWorks({ id: props.courseId, works }))
        }

        // 次のページの課題を取得
        if (msg.pageToken && counter < 6) {
          getWorks(setLoading, props.courseId, msg.pageToken)
          return
        }
        if (!works.length) {
          props.onClose(false)
        }
      }
      setLoading(false);
    }

    // 取得失敗
    function bad_get() {
      setLoading(false);
      props.onClose(false)
    }

    ipcRenderer.on("get_works_" + props.courseId, get);
    ipcRenderer.on("get_works_failed_" + props.courseId, bad_get);
    return () => {
      ipcRenderer.removeListener("get_works_" + props.courseId, get);
      ipcRenderer.removeListener("get_works_failed_" + props.courseId, bad_get);
    };
  }, []);

  // ログインした人が変わったら取得し直し
  React.useEffect(() => {
    if (auth1 !== auth && !router.query.code) {
      props.onClose(true)
      setCounter(0)
      dispatch(slice.actions.setWorks({ id: props.courseId, works: [] }))
      getWorks(setLoading, props.courseId);
      setAuth1(auth);
    }
  }, [props.courseId, auth]);

  const loadingDom = (
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
        {loadingDom}
        {!loading && !works.length && empWork}
      </div>
    </Style>
  );
};

export default Component;
