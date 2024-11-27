import { ItemDataProps } from '@/app/(dashboard)/environment/laboratory/[uuid]/materials/[...dirs]/GridSortable/types';
import { FormDataProps } from '@/app/(dashboard)/environment/laboratory/[uuid]/materials/[...dirs]/MaterialModal';
import {
  BlankItemProps,
  FlattenedItemProps,
  TreeItemProps,
  TreeItems,
} from '@/app/(dashboard)/environment/laboratory/[uuid]/materials/[...dirs]/TreeSortable/types';
import {
  flattenTree,
  removeChildrenOf,
} from '@/app/(dashboard)/environment/laboratory/[uuid]/materials/[...dirs]/TreeSortable/utilities';
import { UniqueIdentifier } from '@dnd-kit/core';
import {
  ActionReducerMapBuilder,
  AsyncThunk,
  createSlice,
  current,
  PayloadAction,
} from '@reduxjs/toolkit';
import { isEqual } from 'lodash';
import { fetchMaterials } from '../middleware';
import { findItemByDir, generateItems } from './utils';

export interface LaboratoryStateProps {
  currentPath?: UniqueIdentifier[];
  activeItem: TreeItemProps | null;
  items: TreeItemProps[];
  gridItems: ItemDataProps[];
  flattenedItems: FlattenedItemProps[];
  activeId: UniqueIdentifier | null;
  overId: UniqueIdentifier | null;

  isShowingSetMaterialModal?: boolean;
  isShowingSetMaterialModalFor?: BlankItemProps | TreeItemProps;

  status: 'loading' | 'idle' | 'error';
}

const initialStateLaboratory: LaboratoryStateProps = {
  activeItem: null,
  activeId: null,
  overId: null,
  isShowingSetMaterialModal: false,
  isShowingSetMaterialModalFor: undefined,
  items: [],
  gridItems: [],
  flattenedItems: [],
  status: 'idle',
};

const laboratorySlice = createSlice({
  name: 'laboratory',
  initialState: initialStateLaboratory,
  reducers: {
    setItems: (state, action: PayloadAction<TreeItemProps[]>) => {
      state.items = action.payload;
      const syncState = syncGridAndFlattenedItems(state);
      state.gridItems = syncState.gridItems;
      state.flattenedItems = syncState.flattenedItems;
    },
    updatePosition: (
      state,
      action: PayloadAction<{
        activeIndex: number;
        overIndex: number;
      }>,
    ) => {
      const { activeIndex, overIndex } = action.payload;
      const tmpOverPosition = state.gridItems[overIndex].position;
      
      console.log('tmpOverPosition', current(tmpOverPosition));
      state.gridItems[activeIndex].position = tmpOverPosition;
      console.log('state.gridItems[activeIndex].position', current(state.gridItems[activeIndex]));
      // 更新 items 中对应项目的 position
      const parentItem = findItemByDir(state.items, state.currentPath);
      const activeItem = parentItem?.children.find(
        (item) => item.id === state.gridItems[activeIndex].id,
      );
      const overItem = parentItem?.children.find(
        (item) => item.id === state.gridItems[overIndex].id,
      );
      if (activeItem) {
        activeItem.position = tmpOverPosition;
      }
      if (overItem) {
        overItem.position = state.gridItems[activeIndex].position;
      }
      const syncState = syncGridAndFlattenedItems(state);
      state.gridItems = syncState.gridItems;
    },
    
    setGridItems: (state, action: PayloadAction<ItemDataProps[]>) => {
      // 到这里，我得到了一个更新后的 gridItems 列表，但是其中 activeID 的 position 并没有更新

      // 1. 更新 activeId 的 position
      // 2. 重新从头生成 gridItems
      state.gridItems = action.payload;
    },
    setActiveId: (state, action: PayloadAction<UniqueIdentifier | null>) => {
      state.activeId = action.payload;
    },
    setOverId: (state, action: PayloadAction<UniqueIdentifier | null>) => {
      state.overId = action.payload;
    },
    addMaterial: (state, action: PayloadAction<TreeItemProps>) => {
      const newMaterial = { ...action.payload };
      newMaterial.id = generateUniqueId(state.items, newMaterial.id);
      state.items.push(newMaterial);

      const syncState = syncGridAndFlattenedItems(state);
      state.gridItems = syncState.gridItems;
      state.flattenedItems = syncState.flattenedItems;
    },
    setActiveItem: (state, action: PayloadAction<TreeItemProps['dirs']>) => {
      const dirs = action.payload?.map((dir) =>
        decodeURIComponent(dir.toString()),
      );
      let activeItem = null;

      if (dirs) {
        let currentItems = state.items;
        let currentItem = null;

        for (const dir of dirs) {
          currentItem = currentItems.find((item) => item.id === dir);

          if (!currentItem) {
            break;
          }

          currentItems = currentItem.children;
        }

        activeItem = currentItem;
        activeItem && (activeItem.dirs = dirs);
        state.currentPath = dirs;
      }

      state.activeItem = activeItem || null;
      const syncState = syncGridAndFlattenedItems(state);
      state.gridItems = syncState.gridItems;
      state.flattenedItems = syncState.flattenedItems;
    },

    setShowingSetMaterialModal: (state, action: PayloadAction<boolean>) => {
      state.isShowingSetMaterialModal = action.payload;
    },

    setShowingSetMaterialModalFor: (
      state,
      action: PayloadAction<BlankItemProps['position']>,
    ) => {
      const foundItem = state.gridItems.find((item) => {
        return isEqual(item.position, action.payload);
      });

      state.isShowingSetMaterialModalFor = foundItem;
    },

    addChildren: (state, action: PayloadAction<FormDataProps>) => {
      const { name, type, description, position } = action.payload;
      const parent = findItemByDir(state.items, state.currentPath);

      if (parent) {
        parent.children.push({
          id: name,
          type,
          position,
          children: [],
          status: 'idle',
        });

        // Ensure that state.items is updated to reflect the new child
        state.items = [...state.items];

        // Synchronize gridItems and flattenedItems
        const syncState = syncGridAndFlattenedItems(state);
        state.gridItems = syncState.gridItems;
        state.flattenedItems = syncState.flattenedItems;
      }
    },
  },
  extraReducers: (builder) => {
    // createAsyncReducers<TreeItems>(builder, fetchMaterials, 'items');
    builder
      .addCase(fetchMaterials.pending, (state: LaboratoryStateProps) => {
        state.status = 'loading';
      })
      .addCase(
        fetchMaterials.fulfilled,
        (state, action: PayloadAction<TreeItemProps[]>) => {
          laboratorySlice.caseReducers.setItems(state, action);
          state.status = 'idle';
        },
      )
      .addCase(fetchMaterials.rejected, (state, action) => {
        state.status = 'error';
      });
  },
});

// FIXME: Not work properly
const createAsyncReducers = <T>(
  builder: ActionReducerMapBuilder<LaboratoryStateProps>,
  asyncThunk: AsyncThunk<T, any, any>,
  stateKey: keyof LaboratoryStateProps,
) => {
  builder
    .addCase(asyncThunk.pending, (state: LaboratoryStateProps) => {
      state.status = 'loading';
    })
    .addCase(
      asyncThunk.fulfilled,
      (state: LaboratoryStateProps, action: PayloadAction<T>) => {
        (state[stateKey] as unknown as T) = action.payload;
        state.status = 'idle';
      },
    )
    .addCase(asyncThunk.rejected, (state: LaboratoryStateProps) => {
      state.status = 'error';
    });
};

export const {
  setItems,
  setGridItems,
  updatePosition,
  setActiveId,
  setOverId,
  addMaterial,
  setActiveItem,
  setShowingSetMaterialModal,
  setShowingSetMaterialModalFor,
  addChildren,
} = laboratorySlice.actions;

export default laboratorySlice.reducer;

function generateUniqueId(
  materials: TreeItems,
  id: UniqueIdentifier,
): UniqueIdentifier {
  let uniqueId = id;
  let counter = 1;

  const idSet = new Set(materials.map((material) => material.id));

  while (idSet.has(uniqueId)) {
    uniqueId = `${id} ${counter}`;
    counter++;
  }

  return uniqueId;
}

function syncGridAndFlattenedItems(state: LaboratoryStateProps): {
  gridItems: LaboratoryStateProps['gridItems'];
  flattenedItems: LaboratoryStateProps['flattenedItems'];
} {
  const item = findItemByDir(state.items, state.currentPath);
  const gridItems = generateItems(
    state.activeItem?.layout?.itemCount || 15,
    state.activeItem?.layout?.gridContainerColumns || 5,
    item?.children || [],
  ).gridItems;

  const flattenedTree = flattenTree(state.items);
  const collapsedItems = flattenedTree.reduce<string[]>(
    (acc, { children, collapsed, id }) =>
      collapsed && children.length ? [...acc, id.toString()] : acc,
    [],
  );
  const flattenedItems = removeChildrenOf(
    flattenedTree,
    state.activeId ? [state.activeId, ...collapsedItems] : collapsedItems,
  );

  return { gridItems, flattenedItems };
}
