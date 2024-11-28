import type { UniqueIdentifier } from '@dnd-kit/core';
import type { MutableRefObject } from 'react';

export interface TreeItemProps {
  id: UniqueIdentifier;
  dirs?: UniqueIdentifier[];
  children: TreeItemProps[];
  collapsed?: boolean;

  type?: 'Repository' | 'Plate' | 'Container';
  position?: {
    x: number;
    y: number;
    z?: number;
  };
  layout?: {
    gridContainerColumns?: number;
    itemCount?: number;
  };
  status?: 'active' | 'inactive' | 'disabled' | 'idle';
}

export interface BlankItemProps {
  // children is not allowed in BlankItemProps, it is used as a type guard
  id: UniqueIdentifier;
  dirs?: UniqueIdentifier[];
  position?: {
    x: number;
    y: number;
    z?: number;
  };
  conflict?: boolean;
  conflictItems?: TreeItemProps[];
  msg?: string;
}

export type TreeItems = TreeItemProps[];

export interface FlattenedItemProps extends TreeItemProps {
  parentId: UniqueIdentifier | null;
  depth: number;
  index: number;
}

export type SensorContext = MutableRefObject<{
  items: FlattenedItemProps[];
  offset: number;
}>;
