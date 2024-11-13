import { useDraggable, UseDraggableArguments } from '@dnd-kit/core';
import React from 'react';

export function Draggable(
  props: UseDraggableArguments & { children: React.ReactNode },
) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <button
      name="button"
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {props.children}
    </button>
  );
}
