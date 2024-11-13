import { useDroppable, UseDroppableArguments } from '@dnd-kit/core';
import React from 'react';

export function Droppable(
  props: UseDroppableArguments & { children: React.ReactNode },
) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}
