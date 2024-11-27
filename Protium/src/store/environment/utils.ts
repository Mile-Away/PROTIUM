import { createRange } from '@/app/(dashboard)/environment/laboratory/[uuid]/materials/[...dirs]/GridSortable/utils';
import {
  BlankItemProps,
  TreeItemProps,
} from '@/app/(dashboard)/environment/laboratory/[uuid]/materials/[...dirs]/TreeSortable/types';

// 独立的生成初始化数组并插入 children 的函数
export const generateItems = (
  itemCount: number,
  gridContainerColumns: number,
  childItems: TreeItemProps[],
): { gridItems: (BlankItemProps | TreeItemProps)[]; hasConflict: boolean } => {
  // 创建初始的 items 列表
  const initialItems = createRange<BlankItemProps>(itemCount, (index) => {
    const row = String.fromCharCode(
      65 + Math.floor(index / gridContainerColumns),
    );
    const column = (index % gridContainerColumns) + 1;
    return {
      id: `${row}${column}`,
      position: { x: Math.floor(index / gridContainerColumns), y: column - 1 },
    };
  });

  let hasConflict = false;

  // 创建一个 Map 来存储每个位置的 childItems
  const positionMap: Map<string, TreeItemProps[]> = new Map();

  // 填充 positionMap
  for (const child of childItems) {
    if (child.position) {
      const { x, y } = child.position;
      const key = `${x},${y}`;
      if (!positionMap.has(key)) {
        positionMap.set(key, []);
      }
      positionMap.get(key)!.push(child);
    }
  }

  // 根据 positionMap 更新 initialItems
  for (const [key, items] of positionMap.entries()) {
    const [x, y] = key.split(',').map(Number);
    const index = x * gridContainerColumns + y;

    if (items.length > 1) {
      initialItems[index].conflict = true;
      initialItems[index].conflictItems = items;
      initialItems[index].msg =
        `Conflict detected: ${items.length} items already exists at Position (${x}, ${y})`;
      hasConflict = true;
    } else {
      initialItems[index] = {
        ...items[0],
        position: { x, y },
      };
    }
  }

  return { gridItems: initialItems, hasConflict };
};

export const checkIsBlankItem = (
  item: BlankItemProps | TreeItemProps,
): boolean => {
  // Type guard to check if item is TreeItemProps
  const isTreeItem = (
    item: BlankItemProps | TreeItemProps,
  ): item is TreeItemProps => {
    return 'type' in item;
  };

  // Use the type guard to determine the type of item
  if (isTreeItem(item)) {
    return true;
  } else {
    return false;
  }
};

// 根据 dir 找到唯一的文件
export const findItemByDir = (
  items: TreeItemProps[],
  directions: TreeItemProps['dirs'],
): TreeItemProps | null => {
  const dirs = directions?.map((dir) => decodeURIComponent(dir.toString()));

  if (!dirs) {
    return null;
  }

  let currentItems = items;
  let currentItem = null;

  for (const dir of dirs) {
    currentItem = currentItems.find((item) => item.id === dir);

    if (!currentItem) {
      break;
    }

    currentItems = currentItem.children;
  }

  if (!currentItem) {
    return null;
  }

  return currentItem;
};
