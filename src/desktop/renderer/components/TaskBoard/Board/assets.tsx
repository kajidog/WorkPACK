import React from 'react'
import { Task, Position, Size } from '../../../store/tasks'
import Item, { Props } from '../Item'
import MathComponent, { Props as MathProps1 } from '../Math'
import Memo from '../../Item/Memo'
import Announce from '../../Item/Announce'
import Iframe from '../../Item/Iframe'
import { ResizeTarget } from '.'
const MIN_MATH_WIDTH = 15
const MIN_MATH_HEIGHT = 10

export const mapInfo = (
  information: Task[],
  itemProps: Omit<Props, 'key' | 'id' | 'position' | 'size' | 'options'>,
  onChange: (task: Task[]) => void,
) => {
  const changeMemo = (id: string) => (word: string) => {
    const next: Task[] = []
    information.forEach((item) => {
      if (item.id === id && item.props.type === 'memo') {
        next.push({ ...item, props: { ...item.props, word } })
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
          return <Memo onChange={changeMemo(info.id)} word={info.props.word} />
        case 'announce':
          return <Announce announce={info.props.announce} />
        case 'iframe':
          return <Iframe url={info.props.url} />
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
export const Math = (props: MathProps) =>
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

export const getBordWidth = (info: Task[]) => {
  let size = {
    width: 0,
    height: 0,
  }

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

export const getItemPosition = (id: string, info: Task[]) => {
  for (let item of info) {
    if (item.id === id) {
      return item.position
    }
  }
  return -1
}

export const setInfoSize = (id: string, size: Size, info: Task[]) => {
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

export const deleteInfo = (id: string, info: Task[]) => {
  const next: Task[] = []
  info.forEach((item) => item.id !== id && next.push(item))
  return next
}

export const changeToggleInfo = (
  id: string,
  info: Task[],
  toggle?: boolean,
) => {
  let nextInfo: Task[] = []
  info.forEach((item) => {
    if (item.id === id) {
      nextInfo.push({
        ...item,
        options: { ...item.options, hide: toggle || !item.options.hide },
      })
    } else nextInfo.push(item)
  })
  return nextInfo
}

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
      height = target.size.height
      break
    case 'bottom':
      width = target.size.width
  }
  return { width, height }
}

export const getCardPosition = (next: Position, target: ResizeTarget & { orgin: Position }) => {
  let x = target.orgin.x + (next.x - target.position.x)
  let y = target.orgin.y + (next.y - target.position.y)
  x < 0 && (x = 0)
  y < 0 && (y = 0)
  return { x, y }
}
