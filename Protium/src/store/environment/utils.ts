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
): (BlankItemProps | TreeItemProps)[] => {
  // 创建初始的 items 列表
  const initialItems = createRange<BlankItemProps>(itemCount, (index) => {
    const row = String.fromCharCode(
      65 + Math.floor(index / gridContainerColumns),
    );
    const column = (index % gridContainerColumns) + 1;
    return { id: `${row}${column}` };
  });

  // 根据 children 的位置更新 initialItems
  for (const child of childItems) {
    if (child.position) {
      const { x, y } = child.position;
      const index = x * gridContainerColumns + y;
      initialItems[index] = {
        ...initialItems[index],
        ...child,
      };
    }
  }

  return initialItems;
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
