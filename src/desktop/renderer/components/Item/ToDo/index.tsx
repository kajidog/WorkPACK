import React from "react"
import { Style } from "./style"
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
export type todo = {
    id: number
    done: boolean;
    title: string;
}[]
export type Props = {
    onChange: (nextProps: todo) => void;
    todo: todo
}

const getId = (todo: todo) => {
    let max = 0
    todo.forEach((task => {
        task.id > max && (max = task.id)
    }))
    return max + 1
}

const Component: React.FC<Props> = (props) => {
    const [addText, setAddText] = React.useState("")
    const [addToggle, setAddToggle] = React.useState(true)

    // 文字変更
    const handleChange = (event: any) => {
        setAddText(event.target.value)
    }

    // 
    const changeAddToggle = () => {
        setAddToggle(true)
    }

    const changeDone = (target: number) => () => {
        const next: todo = [];
        props.todo.forEach((task, index) => {
            if (index === target) {
                next.push({ ...task, done: !task.done })
            } else next.push(task)
        })

        props.onChange(next)
    }
    const addTask = (e: any) => {
        e.preventDefault();
        addText.length && props.onChange([...props.todo, { title: addText, done: false, id: getId(props.todo) }]);
        changeAddToggle();
        setAddText("");
    }
    const deleteTask = (target: number) => () => {
        const next: todo = [];
        props.todo.forEach((task, index) => index !== target && next.push(task))
        props.onChange(next)
    }
    const mapTodo = props.todo.map((task, index) => (
        <li key={task.id} >
            <input type="checkbox" onChange={changeDone(index)} checked={task.done} />
            <span>{task.title}</span>
            <button onClick={deleteTask(index)}><DeleteIcon fontSize="inherit" /></button>
        </li>
    ))
    const addDom = (
        <div className="add_todo" >
            <form onSubmit={addTask}>
                <input autoFocus type="text" value={addText} onChange={handleChange} />
                <button type="submit" className="add_button" ><AddIcon fontSize="inherit" /></button>
            </form>
        </div>
    )
    return (
        <Style>
            <ul>
                {mapTodo}
            </ul>

            {!addToggle && <div><button onClick={changeAddToggle} className="add_button"  ><AddIcon fontSize="inherit" /></button></div>}
            {addToggle && addDom}       

        </Style>
    )
}

export default Component


