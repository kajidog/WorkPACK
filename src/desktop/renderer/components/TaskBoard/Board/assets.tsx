import React from 'react'

import { Task, Position, Size } from '../../../store/tasks'
import Item, { Props } from '../Item'
import MathComponent, { Props as MathProps1 } from '../Math'
import Memo from '../../Item/Memo'
import Announce from '../../Item/Announce'
import Iframe from '../../Item/Iframe'
import WorkMaterial from '../../Item/WorkMaterial'
import Todo, { todo } from "../../Item/ToDo"
import Img from "../../Item/Img"
import { ResizeTarget } from '.'
import { HEIGHT, WIDTH } from '../Item/style'
import { getHTML } from '../../../utils'

// タスクカードの中身表示
export const mapInfo = (
  information: Task[],
  itemProps: Omit<Props, 'key' | 'id' | 'position' | 'size' | 'options'>,
  onChange: (task: Task[]) => void,
) => {

  // 戻り値が文字のイベント
  const changeMemo = (id: number) => (word: string) => {
    const next: Task[] = []
    information.forEach((item) => {
      if (item.id === id) {
        switch (item.props.type) {
          case "memo":
            next.push({ ...item, props: { ...item.props, word, html: getHTML(word) } })
            break;
          case "announce":
            next.push({ ...item, props: { ...item.props, announce: { ...item.props.announce, text: word }, html: getHTML(word) } })
            break;
          case "workMaterial":
            next.push({ ...item, props: { ...item.props, material: { ...item.props.material, description: word }, html: getHTML(word) } })
            break;
        }
      } else next.push(item)
    })
    onChange(next)
  }

  // 戻り値が画像のイベント
  const changeImg = (id: number) => (img: any) => {
    const next: Task[] = []
    information.forEach((item) => {
      if (item.id === id) {
        switch (item.props.type) {

          case "img":
            next.push({ ...item, props: { ...item.props, img } })
        }
      } else next.push(item)
    })
    onChange(next)
  }

  // todoのイベント
  const changeTodo = (id: number) => (todo: todo) => {
    const next: Task[] = []
    information.forEach((item) => {
      if (item.id === id && item.props.type === 'todo') {
        next.push({ ...item, props: { ...item.props, todo } })
      } else next.push(item)
    })
    onChange(next)
  }


  return information.map((info) => {
    const Child = () => {
      if (!info.props) {
        return <></>
      }
      switch (info.props.type) {
        case 'memo':
          return <Memo html={info.props.html} onChange={changeMemo(info.id)} word={info.props.word} />
        case 'announce':
          return <Announce onChange={changeMemo(info.id)} html={info.props.html} announce={info.props.announce} />
        case 'workMaterial':
          return <WorkMaterial onChange={changeMemo(info.id)} html={info.props.html} material={info.props.material} />
        case 'iframe':
          return <Iframe url={info.props.url} />
        case 'markdown':
          return null
        case 'todo':
          return <Todo todo={info.props.todo} onChange={changeTodo(info.id)} />
        case 'img':
          return <Img img={info.props.img} onChange={changeImg(info.id)} id={info.id} />
      }
    }
    return (
      <Item
        {...itemProps}
        key={'info_item_' + info.id}
        id={info.id}
        position={info.position}
        size={info.size}
        options={info.options}
      >
        {Child()}
      </Item>
    )
  })
}

// タスクカードの情報を変更
export const setInfoData = (
  target: ResizeTarget,
  position: Position,
  info: Task[],
) => {
  let last: Task | undefined
  const _info = info.slice()
  const next: Task[] = []

  _info.forEach((item) => {
    if (item.id === target.id) {
      let x = item.position.x + (position.x - target.position.x)
      let y = item.position.y + (position.y - target.position.y)
      x < 0 && (x = 0)
      y < 0 && (y = 0)
      last = {
        ...item,
        position: {
          x,
          y,
        },
      }
    } else next.push(item)
  })
  last && next.push(last)

  return next
}

export type MathProps = Omit<MathProps1, 'position'> & { size: Size }

// マス目を生成
export const MathP = (props: MathProps) =>
  Array(props.size.height)
    .fill(0)
    .map((_, y) =>
      Array(props.size.width)
        .fill(0)
        .map((_, x) => (
          <MathComponent
            key={'math_' + x + '_' + y}
            {...props}
            position={{ x, y }}
          />
        )),
    )

// ボードの幅を取得
export const getBoardWidth = (info: Task[], width: number, height: number) => {
  let size = {
    width: 0,
    height: 0,
  }
  const MIN_MATH_WIDTH = Math.ceil(width / WIDTH)
  const MIN_MATH_HEIGHT = Math.ceil(height / HEIGHT)

  info.forEach((item) => {
    const width = item.position.x + item.size.width
    let height = item.position.y + item.size.height
    if (item.options.hide) height = 1
    width > size.width && (size.width = width)
    height > size.height && (size.height = height)
  })
  size.width < MIN_MATH_WIDTH && (size.width = MIN_MATH_WIDTH)
  size.height < MIN_MATH_HEIGHT && (size.height = MIN_MATH_HEIGHT)
  return size
}

// ポジション変更
export const getItemPosition = (id: number, info: Task[]) => {
  for (let item of info) {
    if (item.id === id) {
      return item.position
    }
  }
  return -1
}

// サイズ変更
export const setInfoSize = (id: number, size: Size, info: Task[]) => {
  let nextInfo: Task[] = []
  let last: Task | undefined
  info.forEach((item) => {
    if (item.id === id) {
      last = { ...item, size }
    } else nextInfo.push(item)
  })
  last && nextInfo.push(last)
  return nextInfo
}

// カード削除
export const deleteInfo = (id: number, info: Task[]) => {
  const next: Task[] = []
  info.forEach((item) => item.id !== id && next.push(item))
  return next
}

// カードの表示切り替え
export const changeToggleInfo = (
  id: number,
  info: Task[],
  toggle?: boolean,
) => {
  let nextInfo: Task[] = []
  let last: Task | undefined = undefined;
  info.forEach((item) => {
    if (item.id === id) {
      last = {
        ...item,
        options: { ...item.options, hide: toggle || !item.options.hide },
      }
    } else nextInfo.push(item)
  })
  last && nextInfo.push(last)
  return nextInfo
}

// カードのサイズを取得
export const getCardSize = (
  nextPosition: Position,
  target: ResizeTarget,
): Size => {
  let width = nextPosition.x - target.position.x + 1
  let height = nextPosition.y - target.position.y + 1
  width < 1 && (width = 1)
  height < 1 && (height = 1)
  switch (target.type) {
    case 'right':
    case 'left':
      height = target.size.height
      break
    case 'bottom':
    case 'top':
      width = target.size.width;
  }
  return { width, height }
}

// タスクカードの位置を取得
export const getCardPosition = (next: Position, target: ResizeTarget & { origin: Position }) => {
  let x = target.origin.x + (next.x - target.position.x)
  let y = target.origin.y + (next.y - target.position.y)
  x < 0 && (x = 0)
  y < 0 && (y = 0)
  return { x, y }
}

// タイトル変更
export const changeTitle = (id: number, title: string, tasks: Task[]) => {
  const next: Task[] = []
  tasks.forEach(task => {
    if (task.id === id) {
      next.push({ ...task, options: { ...task.options, title } })
    } else next.push(task)
  })
  return next
}