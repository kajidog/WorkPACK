import Style from "./style";
import React from "react"
import { useCourses } from "../../../../store/classroom/selector";
import { ipcRenderer } from "electron";
import { courseWorkMaterial } from "../../../../store/classroom";

export type Props = {
  onSubmit: (courseWorkMaterial: courseWorkMaterial) => void;
  courseId: string
};

// 単語検索
const filerWord = (target: courseWorkMaterial[], word: string) => {
  let result: courseWorkMaterial[] = []
  target.forEach((item) => {
    item.description && item.description.includes(word) && result.push(item)
  })
  return result
}


const Component: React.FC<Props> = (props) => {
  const [searchWord, setSearchWord] = React.useState("")
  const [works, setWorks] = React.useState<courseWorkMaterial[]>([])
  const [loading, setLoading] = React.useState(false)
  const [err, setError] = React.useState(false)
  const { courses } = useCourses();
  const [result, setResult] = React.useState<courseWorkMaterial[]>([])
  const [course] = React.useState(() => {
    for (const i of courses) {
      if (i.id === props.courseId) {
        return i
      }
    }
  })

  // 課題取得開始
  const getWork = (pageToken?: string) => {
    setLoading(true)
    let option: any = {
      courseId: props.courseId,
      pageToken
    }
    ipcRenderer.send("get_course_work_materials", option)
  }



  React.useEffect(() => {
    getWork()
    let works: courseWorkMaterial[] = []
    let count = 0;

    // 課題受信
    function set(_: any, args: any) {
      if (args[0]) {
        works = [...works, ...args[0]]
        setWorks(works)
      }
      if (args[1] && count++ < 5) {
        getWork(args[1])
        return
      }
      setLoading(false)
      setError(false)
    }

    // 課題取得失敗
    function fail() {
      setLoading(false)
      setError(true)
    }

    ipcRenderer.on("get_course_work_materials_" + props.courseId, set)
    ipcRenderer.on("get_course_work_materials_failed_" + props.courseId, fail)
    return () => {
      ipcRenderer.removeListener("get_work_info_" + props.courseId, set)
      ipcRenderer.removeListener("get_work_info_failed_" + props.courseId, fail)
    }
  }, []);

  // 課題クリックイベント
  const handleClick = (id: string) => () => {
    for (const item of works) {
      if (item.id === id) {
        props.onSubmit(item)
      }
    }
  };

  // 課題をリストで表示 検索の文字が入っていた場合は検索結果の配列を表示
  const mapCourses = (searchWord.length ? result : works).map((item) => (
    <li key={item.id} onClick={handleClick(item.id)} >
      <h2>{item.title}</h2>
      <div>
        {item.description}
      </div>
    </li>
  ));

  // 検索文字入力イベント 
  const handleChange = (event: any) => {
    setResult(filerWord(works, event.target.value))
    setSearchWord(event.target.value)
  }

  // 検索部品
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
        {err && "ありません"}
        {mapCourses}
        {loading && <li>通信中</li>}
      </ul>
    </Style>
  );
};

export default Component;
