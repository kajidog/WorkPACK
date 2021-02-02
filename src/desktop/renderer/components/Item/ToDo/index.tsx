import React from "react"
import { Style } from "./style"

export type todo = {
    done: boolean;
    title: string;
}[]
export type Props = {
    onChange: (nextProps: todo) => void;
    todo: todo
}

const Component: React.FC<Props> = (props) => {
    const [addText, setAddText] = React.useState("")
    const [addToggle, setAddToggle] = React.useState(false)

    // 文字変更
    const handleChange = (event: any) => {
        setAddText(event.target.value)
    }

    // 
    const changeAddToggle = () => {
        setAddToggle(!addToggle)
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
        props.onChange([...props.todo, { title: addText, done: false }]);
        changeAddToggle();
        setAddText("");
    }
    const deleteTask = (target: number) => () => {
        const next: todo = [];
        props.todo.forEach((task, index) => index !== target && next.push(task))
        props.onChange(next)
    }
    const mapTodo = props.todo.map((task, index) => (
        <li key={task.title} >
            <input type="checkbox" onChange={changeDone(index)} checked={task.done} />
            <span>{task.title}</span>
            <button onClick={deleteTask(index)}>delete</button>
        </li>
    ))
    const addDom = (
        <div className="add_todo" >
            <form onSubmit={addTask}>
                <input autoFocus type="text" value={addText} onChange={handleChange} />
                <button type="submit" >add</button>
            </form>
        </div>
    )
    return (
        <Style>
            <ul>{mapTodo}</ul>

            {!addToggle && <div><button onClick={changeAddToggle} >add</button></div>}
            {addToggle && addDom}

        </Style>
    )
}

export default Component


