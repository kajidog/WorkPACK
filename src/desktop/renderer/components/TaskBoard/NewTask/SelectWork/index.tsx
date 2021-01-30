import Style from "./style";
import React from "react"
import { useCourses } from "../../../../store/classroom/selector";
import { ipcRenderer } from "electron";
import { Announce } from "../../../../store/classroom";

export type Props = {
  onSubmit: (announce: Announce) => void;
  courseId: string
  isAnnunce: boolean
};

const filerWord = (target: any[], word: string) => {
  let result: any[] = []
  target.forEach((item) => {
    item.text.includes(word) && result.push(item)
  })
  return result
}


const Component: React.FC<Props> = (props) => {
  const [searchWord, setSearchWord] = React.useState("")
  const [works, setWorks] = React.useState<any[]>([])
  const [nextToken, setnextToken] = React.useState(undefined)
  const [loading, setLoading] = React.useState(false)
  const [err, setError] = React.useState(false)
  const { courses } = useCourses();
  const [result, setResult] = React.useState<any[]>([])
  const [course] = React.useState(() => {
    for (const i of courses) {
      if (i.id === props.courseId) {
        return i
      }
    }
  })
  const getWork = () => {
    if (loading) {
      return
    }
    setLoading(true)
    let option: any = {
      courseId: props.courseId,

    }
    nextToken && (option["pageToken"] = nextToken)
    ipcRenderer.send("get_work_info", option)
  }



  React.useEffect(() => {
    getWork()

    function set(event: any, args: any) {
      console.log(event);
      if (args[0]) {
        setWorks([...works, ...args[0]])
      }
      setnextToken(args[1])
      setLoading(false)
      setError(false)
    }
    function fail() {
      setLoading(false)
      setError(true)
    }
    ipcRenderer.on("get_work_info_" + props.courseId, set)
    ipcRenderer.on("get_work_info_failed_" + props.courseId, fail)
    return () => {
      ipcRenderer.removeListener("get_work_info_" + props.courseId, set)
      ipcRenderer.removeListener("get_work_info_failed_" + props.courseId, fail)
    }
  }, [])
  const handleClick = (id: string) => () => {
    //   if(props.isAnnunce){
    //     for(const item of works){
    //       if(item.id === id){
    //         dispatch(slice.actions.setAnnnounce({announce: item}))
    //       }
    //     }
    //   }
    for (const item of works) {
      if (item.id === id) {
        props.onSubmit(item)
      }


    }

  };
  const mapCourses = (searchWord.length ? result : works).map((item) => (
    <li key={item.id} onClick={handleClick(item.id)} >
      <div>
        {item.text || item.description}
      </div>
    </li>
  ));

  const handleChange = (event: any) => {
    setResult(filerWord(works, event.target.value))
    setSearchWord(event.target.value)
  }
  const searchDom = (
    <div className="search_area" >
      <button>フィルター</button>
      <input autoFocus type="text" onChange={handleChange} value={searchWord} />

    </div>
  )

  return (
    <Style>
      <ul>
        <li><h2>{course?.name}</h2>{searchDom}</li>
        {err && "error"}
        {mapCourses}
        {loading && <li>通信中</li>}
      </ul>
    </Style>
  );
};

export default Component;
