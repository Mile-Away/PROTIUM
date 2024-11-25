import { ItemDataProps } from '@/app/(dashboard)/environment/laboratory/[uuid]/materials/[...dirs]/GridSortable/types';
import {
  FlattenedItemProps,
  TreeItemProps,
  TreeItems,
} from '@/app/(dashboard)/environment/laboratory/[uuid]/materials/[...dirs]/TreeSortable/types';
import {
  flattenTree,
  removeChildrenOf,
} from '@/app/(dashboard)/environment/laboratory/[uuid]/materials/[...dirs]/TreeSortable/utilities';
import { UniqueIdentifier } from '@dnd-kit/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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

  //   flattenedMaterials: FlattenedItemProps[];
  isShowingSetMaterialModal?: boolean;
  isShowingSetMaterialModalFor?: TreeItemProps;

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
    setGridItems: (state, action: PayloadAction<ItemDataProps[]>) => {
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

    addChildren: (
      state,
      action: PayloadAction<
        Omit<TreeItemProps & { parentId: UniqueIdentifier }, 'children'>
      >,
    ) => {
      const { id, position, type, parentId, status } = action.payload;
      const parent = findItemByDir(state.items, state.currentPath);

      if (parent) {
        parent.children.push({
          id,
          type,
          position,
          children: [],
          status,
        });
      }
    },
  },
  extraReducers: (builder) => {
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

export const {
  setItems,
  setGridItems,
  setActiveId,
  setOverId,
  addMaterial,
  setActiveItem,
  setShowingSetMaterialModal,
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
  );

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
