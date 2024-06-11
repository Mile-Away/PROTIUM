import { ContextMenuButton } from '@/components/elements/buttons/ContextMenuButton';
import { setActiveMenuItems } from '@/store/workflow/workflowSlice';
import clsx from 'clsx';

import { RootReducerProps } from '@/app/store';
import { Dispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import SubContextMenu from './SubContextMenu';
import contextMenuItems from './contextMenuItems';

export default function RootContextMenu({ level = 0 }: { level: number }) {
  const { contextMenuVisible, contextMenuX, contextMenuY, activeMenuItems } =
    useSelector((state: RootReducerProps) => state.workflow);

  const dispatch = useDispatch();

  const onContextMenuClick = (
    clickEvent: (() => (dispatch: Dispatch) => void) | undefined,
  ) => {
    if (clickEvent) {
      clickEvent()(dispatch);
    }
  };

  return (
    <>
      {contextMenuVisible && (
        <div
          className={clsx(
            'absolute p-1',
            'rounded-md border border-neutral-200  dark:border-neutral-700 dark:bg-neutral-800',
            'shadow-lg dark:shadow-black',
            'fixed z-[9999] h-fit w-28 min-w-fit',
            'select-none',
          )}
          style={{
            top: `${contextMenuY}px`,
            left: `${contextMenuX}px`,
          }}
        >
          <div className="flex flex-col items-start justify-around space-y-2 text-xs">
            {contextMenuItems.map((item) => (
              <div
                key={item.label}
                className="relative w-full"
                onMouseEnter={() => {
                  dispatch(setActiveMenuItems([item.action]));
                }}
              >
                <ContextMenuButton
                  className="w-full"
                  type="button"
                  onClick={() => onContextMenuClick(item.onClick)}
                  arrow={item.arrow}
                  active={activeMenuItems[level] === item.action}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-1 h-3 w-3" />
                    <span>{item.label}</span>
                  </div>
                </ContextMenuButton>
                {item.subContextMenuItems &&
                  activeMenuItems[level] === item.action && (
                    <SubContextMenu
                      onContextMenuClick={onContextMenuClick}
                      level={level + 1}
                      key={item.label}
                      subContextMenuItems={item.subContextMenuItems}
                    />
                  )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
