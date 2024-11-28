import type { UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import type { FlattenedItemProps, TreeItemProps, TreeItems } from './types';

export const iOS =
  typeof navigator !== 'undefined' &&
  /iPad|iPhone|iPod/.test(navigator.userAgent);

function getDragDepth(offset: number, indentationWidth: number) {
  return Math.round(offset / indentationWidth);
}

export function getProjection(
  items: FlattenedItemProps[],
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier,
  dragOffset: number,
  indentationWidth: number,
) {
  const overItemIndex = items.findIndex(({ id }) => id === overId);
  const activeItemIndex = items.findIndex(({ id }) => id === activeId);
  const activeItem = items[activeItemIndex];
  const newItems = arrayMove(items, activeItemIndex, overItemIndex);
  const previousItem = newItems[overItemIndex - 1];
  const nextItem = newItems[overItemIndex + 1];
  const dragDepth = getDragDepth(dragOffset, indentationWidth);
  const projectedDepth = activeItem.depth + dragDepth;
  const maxDepth = getMaxDepth({
    previousItem,
  });
  const minDepth = getMinDepth({ nextItem });
  let depth = projectedDepth;

  if (projectedDepth >= maxDepth) {
    depth = maxDepth;
  } else if (projectedDepth < minDepth) {
    depth = minDepth;
  }

  return { depth, maxDepth, minDepth, parentId: getParentId() };

  function getParentId() {
    if (depth === 0 || !previousItem) {
      return null;
    }

    if (depth === previousItem.depth) {
      return previousItem.parentId;
    }

    if (depth > previousItem.depth) {
      return previousItem.id;
    }

    const newParent = newItems
      .slice(0, overItemIndex)
      .reverse()
      .find((item) => item.depth === depth)?.parentId;

    return newParent ?? null;
  }
}

function getMaxDepth({ previousItem }: { previousItem: FlattenedItemProps }) {
  if (previousItem) {
    return previousItem.depth + 1;
  }

  return 0;
}

function getMinDepth({ nextItem }: { nextItem: FlattenedItemProps }) {
  if (nextItem) {
    return nextItem.depth;
  }

  return 0;
}

function flatten(
  items: TreeItems,
  parentId: UniqueIdentifier | null = null,
  depth = 0,
  dirs: UniqueIdentifier[] = [],
): FlattenedItemProps[] {
  return items.reduce<FlattenedItemProps[]>((acc, item, index) => {
    const currentPath = [...dirs, item.id];
    return [
      ...acc,
      { ...item, parentId, depth, index, dirs: currentPath },
      ...flatten(item.children, item.id, depth + 1, currentPath),
    ];
  }, []);
}

export function flattenTree(items: TreeItems): FlattenedItemProps[] {
  return flatten(items);
}

export function buildTree(flattenedItems: FlattenedItemProps[]): TreeItems {
  const root: TreeItemProps = { id: 'root', children: [] };
  const nodes: Record<string, TreeItemProps> = { [root.id]: root };
  const items = flattenedItems.map((item) => ({ ...item, children: [] }));

  for (const item of items) {
    const { id, children } = item;
    const parentId = item.parentId ?? root.id;
    const parent = nodes[parentId] ?? findItem(items, parentId);

    nodes[id] = { id, children };
    parent.children.push(item);
  }

  return root.children;
}

export function findItem(items: TreeItemProps[], itemId: UniqueIdentifier) {
  return items.find(({ id }) => id === itemId);
}

export function findItemDeep(
  items: TreeItems,
  itemId: UniqueIdentifier,
): TreeItemProps | undefined {
  for (const item of items) {
    const { id, children } = item;

    if (id === itemId) {
      return item;
    }

    if (children.length) {
      const child = findItemDeep(children, itemId);

      if (child) {
        return child;
      }
    }
  }

  return undefined;
}

export function removeItem(items: TreeItems, id: UniqueIdentifier) {
  const newItems = [];

  for (const item of items) {
    if (item.id === id) {
      continue;
    }

    if (item.children.length) {
      item.children = removeItem(item.children, id);
    }

    newItems.push(item);
  }

  return newItems;
}

export function setProperty<T extends keyof TreeItemProps>(
  items: TreeItems,
  id: UniqueIdentifier,
  property: T,
  setter: (value: TreeItemProps[T]) => TreeItemProps[T],
): TreeItems {
  return items.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        [property]: setter(item[property]),
      };
    }

    if (item.children.length) {
      return {
        ...item,
        children: setProperty(item.children, id, property, setter),
      };
    }

    return item;
  });
}

function countChildren(items: TreeItemProps[], count = 0): number {
  return items.reduce((acc, { children }) => {
    if (children.length) {
      return countChildren(children, acc + 1);
    }

    return acc + 1;
  }, count);
}

export function getChildCount(items: TreeItems, id: UniqueIdentifier) {
  const item = findItemDeep(items, id);

  return item ? countChildren(item.children) : 0;
}

// Remove all children of the provided ids
export function removeChildrenOf(
  items: FlattenedItemProps[],
  ids: UniqueIdentifier[],
) {
  const excludeParentIds = [...ids];

  return items.filter((item) => {
    if (item.parentId && excludeParentIds.includes(item.parentId)) {
      if (item.children.length) {
        excludeParentIds.push(item.id);
      }
      return false;
    }

    return true;
  });
}

export const genClickMaterialDir = (
  currentUrl: string,
  dirs?: UniqueIdentifier[],
) => {
  // 找到当前 url 中的 materials，在其后添加 dirs.[\]
  const materialsIndex = currentUrl.indexOf('materials');

  if (materialsIndex === -1) {
    console.error('The current URL does not contain "materials".');
    return;
  }

  // 获取 "materials" 之后的部分
  const beforeMaterials = currentUrl.slice(
    0,
    materialsIndex + 'materials'.length,
  );

  const afterMaterials = currentUrl.slice(materialsIndex + 'materials'.length);

  // 构建新的 URL
  const newUrl = `${beforeMaterials}/${dirs?.join('\\')}`;

  return newUrl;
};
