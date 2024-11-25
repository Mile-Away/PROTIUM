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
  };
  layout?: {
    gridContainerColumns?: number;
    itemCount?: number;
  };
  status?: 'active' | 'inactive' | 'disabled' | 'idle';
}

export interface BlankItemProps {
  id: UniqueIdentifier;
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
