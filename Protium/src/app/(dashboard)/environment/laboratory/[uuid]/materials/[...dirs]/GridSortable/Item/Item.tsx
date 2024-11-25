import React, { useEffect } from 'react';

import { Handle, Remove } from './components';

import { setShowingSetMaterialModal } from '@/store/environment/laboratorySlice';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { TreeItemProps } from '../../TreeSortable/types';
import { ItemProps } from '../types';
import styles from './Item.module.css';

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

      function isTreeItemProps(data: any): data is TreeItemProps {
        return (
          data && Array.isArray(data.children) && typeof data.id !== 'undefined'
        );
      }
      const isOccupied = isTreeItemProps(data);
      const dispath = useDispatch();

      const handleClick = () => {
        dispath(setShowingSetMaterialModal(true));
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
              : 'dark:bg-white/5 dark:hover:bg-white/10',
            ' shadow dark:text-white rounded ',
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
              'relative box-border flex flex-grow items-center justify-center p-4 outline-none',
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
