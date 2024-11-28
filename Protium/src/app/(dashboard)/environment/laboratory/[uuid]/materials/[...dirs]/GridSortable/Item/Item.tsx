import React, { useEffect } from 'react';

import { Handle, Remove } from './components';

import { RootReducerProps } from '@/app/store';
import {
  setShowingSetMaterialModal,
  setShowingSetMaterialModalFor,
} from '@/store/environment/laboratorySlice';
import {
  BeakerIcon,
  ExclamationTriangleIcon,
  InboxIcon,
  Squares2X2Icon,
} from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { TreeItemProps } from '../../TreeSortable/types';
import { ItemProps } from '../types';
import styles from './Item.module.css';
import { isTreeItem } from '@/store/environment/utils';

export const Item = React.memo(
  React.forwardRef<HTMLLIElement, ItemProps>(
    (
      {
        color,
        dragOverlay,
        dragging,
        disabled,
        fadeIn,
        handle,
        handleProps,
        height,
        index,
        listeners,
        onRemove,
        renderItem,
        sorting,
        style,
        transition,
        transform,
        data,
        wrapperStyle,
        ...props
      },
      ref,
    ) => {
      useEffect(() => {
        if (!dragOverlay) {
          return;
        }

        document.body.style.cursor = 'grabbing';

        return () => {
          document.body.style.cursor = '';
        };
      }, [dragOverlay]);

      const { isShowingSetMaterialModal, isShowingSetMaterialModalFor } =
        useSelector((status: RootReducerProps) => status.laboratory);

      // 判断是否是 TreeItem，如果是，则渲染为 TreeItem
 

      const isOccupied = isTreeItem(data);
      const dispatch = useDispatch();

      const handleClick = () => {
        dispatch(setShowingSetMaterialModal(true));
        dispatch(setShowingSetMaterialModalFor(data?.position));
      };

      return renderItem ? (
        renderItem({
          dragOverlay: Boolean(dragOverlay),
          dragging: Boolean(dragging),
          sorting: Boolean(sorting),
          index,
          fadeIn: Boolean(fadeIn),
          listeners,
          ref,
          style,
          transform,
          transition,
        })
      ) : (
        <li
          className={clsx(
            isOccupied
              ? 'dark:bg-indigo-600/80 dark:hover:bg-indigo-600'
              : data?.conflict
                ? 'dark:bg-red-600/80 dark:hover:bg-red-600'
                : 'dark:bg-white/5 dark:hover:bg-white/10',
            ' rounded shadow dark:text-white ',
            styles.Wrapper,
            fadeIn && styles.fadeIn,
            sorting && styles.sorting,
            dragOverlay && styles.dragOverlay,
          )}
          style={
            {
              ...wrapperStyle,
              transition: [transition, wrapperStyle?.transition]
                .filter(Boolean)
                .join(', '),
              '--translate-x': transform
                ? `${Math.round(transform.x)}px`
                : undefined,
              '--translate-y': transform
                ? `${Math.round(transform.y)}px`
                : undefined,
              '--scale-x': transform?.scaleX
                ? `${transform.scaleX}`
                : undefined,
              '--scale-y': transform?.scaleY
                ? `${transform.scaleY}`
                : undefined,
              '--index': index,
              '--color': color,
            } as React.CSSProperties
          }
          ref={ref}
        >
          <div
            onClick={handleClick}
            className={clsx(
              styles.Item,
              'group relative box-border flex flex-grow items-center justify-center p-4 outline-none',
              dragging && styles.dragging,
              handle && styles.withHandle,
              dragOverlay && styles.dragOverlay,
              disabled && styles.disabled,
              color && styles.color,
            )}
            style={style}
            data-cypress="draggable-item"
            {...(!handle ? listeners : undefined)}
            {...props}
            tabIndex={!handle ? 0 : undefined}
          >
            <span className="w-full text-center">{data?.id}</span>
            {!isOccupied && data?.conflict && (
              <>
                <div className="absolute bottom-0 right-0 flex items-center p-2">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                </div>
                <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2  -translate-y-2 group-hover:block">
                  <div className="relative w-[16rem] text-wrap rounded p-2 dark:bg-red-600">
                    <div className="flex items-center mb-4">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-white/80" />
                      <span className="ml-2 whitespace-nowrap text-lg font-semibold text-red-600 dark:text-white/80">
                        Position Conflict
                      </span>
                    </div>
                    {data?.conflictItems?.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 ml-1 mb-1">
                        {item.type === 'Repository' ? (
                          <Squares2X2Icon className="h-4 w-4" />
                        ) : item.type === 'Plate' ? (
                          <InboxIcon className="h-4 w-4 " />
                        ) : item.type === 'Container' ? (
                          <BeakerIcon className="h-4 w-4 " />
                        ) : null}
                        <span className="text-sm font-semibold">{item.id}</span>
                      </div>
                    ))}
                    {/* <span className="text-sm font-semibold ">{data?.msg}</span> */}
                    <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 transform">
                      <svg
                        className="h-4 w-4 text-red-700 dark:fill-red-700 dark:text-red-700"
                        viewBox="0 0 16 16"
                      >
                        <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </>
            )}
            <span className={styles.Actions}>
              {onRemove ? (
                <Remove className={styles.Remove} onClick={onRemove} />
              ) : null}
              {handle ? <Handle {...handleProps} {...listeners} /> : null}
            </span>
          </div>
        </li>
      );
    },
  ),
);
