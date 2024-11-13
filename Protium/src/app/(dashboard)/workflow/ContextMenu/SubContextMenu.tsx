import { ContextMenuItemProps } from '@/@types/workflow';
import { RootReducerProps } from '@/app/store';
import { ContextMenuButton } from '@/components/elements/buttons/ContextMenuButton';
import { setActiveMenuItems } from '@/store/workflow/workflowSlice';
import { Dispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
const SubContextMenu = ({
  onContextMenuClick,
  subContextMenuItems,
  level,
}: {
  onContextMenuClick: (
    clickEvent: (() => (dispatch: Dispatch) => void) | undefined,
  ) => void;
  level: number;
  subContextMenuItems: ContextMenuItemProps[];
}) => {
  const { activeMenuItems } = useSelector(
    (state: RootReducerProps) => state.workflow,
  );

  const dispatch = useDispatch();

  return (
    <div
      className="absolute left-full top-0 ml-2 flex w-28 min-w-fit flex-col
     space-y-2 rounded-md border border-neutral-200 bg-white
      p-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-black"
    >
      {subContextMenuItems.map((item) => (
        <div
          key={item.label}
          className="relative w-full"
          onMouseEnter={() =>
            dispatch(
              setActiveMenuItems([
                ...activeMenuItems.slice(0, level),
                item.action,
              ]),
            )
          }
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
            activeMenuItems &&
            activeMenuItems[level] === item.action && (
              <SubContextMenu
                onContextMenuClick={onContextMenuClick}
                level={level + 1}
                subContextMenuItems={item.subContextMenuItems}
              />
            )}
        </div>
      ))}
    </div>
  );
};

export default SubContextMenu;
