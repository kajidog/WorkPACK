import Style from "./style";
import { getWorks, mapWorks } from "./assets";
import { useUserState } from "../../../store/user/selector";
import { ipcRenderer } from "electron";
import { Work } from "../../../store/classroom";
import React from "react";
import Coffee1 from "./coffe";
import Coffee from "../../../svg/Coffee";
import { useRouter } from "next/router";
export type Props = {
  courseId: string;
  onClose: (courseId: string) => void
};

const Component: React.FC<Props> = (props) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState<boolean|null>(null);
  const [works, setWorks] = React.useState<Work[]>([]);
  const { auth } = useUserState();
  const [auth1, setAuth1] = React.useState(null);
  React.useEffect(() => {
    function get(_:any, msg: any) {
      if (msg){
         setWorks(msg);
          if(!msg.length){
            props.onClose(props.courseId)
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
      getWorks(setLoading, props.courseId, auth);
      setAuth1(auth);
    }
  }, [props.courseId, auth]);
  React.useEffect(()=>{
    if(loading !== null && !works.length){
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
        <br/>
        <div>課題はありません</div>
      </div>
    </div>
  );

  return (
    <Style>
      <div className="map_item">
        {loading && liadingDom}
        {mapWorks(works, props.courseId)}
        {!loading && !works.length && empWork}
      </div>
    </Style>
  );
};

export default Component;
