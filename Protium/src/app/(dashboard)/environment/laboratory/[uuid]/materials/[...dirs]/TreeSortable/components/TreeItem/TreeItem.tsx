import React, { forwardRef, HTMLAttributes } from 'react';

import { RootReducerProps } from '@/app/store';
import { UniqueIdentifier } from '@dnd-kit/core';
import {
  BeakerIcon,
  InboxIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { genClickMaterialDir } from '../../utilities';
import { Action, Remove } from '../components';
import styles from './TreeItem.module.css';

export interface Props extends Omit<HTMLAttributes<HTMLLIElement>, 'id'> {
  childCount?: number;
  clone?: boolean;
  collapsed?: boolean;
  depth: number;
  disableInteraction?: boolean;
  disableSelection?: boolean;
  ghost?: boolean;
  handleProps?: any;
  indicator?: boolean;
  indentationWidth: number;
  value: string;
  dirs?: UniqueIdentifier[];
  type?: 'Repository' | 'Plate' | 'Container';
  onCollapse?(): void;
  onRemove?(): void;
  wrapperRef?(node: HTMLLIElement): void;
}

export const TreeItem = forwardRef<HTMLDivElement, Props>(
  (
    {
      childCount,
      clone,
      depth,
      disableSelection,
      disableInteraction,
      ghost,
      handleProps,
      indentationWidth,
      indicator,
      collapsed,
      onCollapse,
      onRemove,
      style,
      value,
      type,
      wrapperRef,
      dirs,
      ...props
    },
    ref,
  ) => {
    const router = useRouter();
    const currentUrl = usePathname();

    const handleClickDir = (e: React.MouseEvent) => {
      const newUrl = genClickMaterialDir(currentUrl, dirs);

      // 使用 router.push 导航到新的 URL
      newUrl && router.push(newUrl);
    };

    const { activeItem } = useSelector(
      (state: RootReducerProps) => state.material,
    );

    return (
      <li
        className={clsx(
          styles.Wrapper,
          clone && styles.clone,
          ghost && (styles.ghost, 'opacity-50'),
          indicator && styles.indicator,
          disableSelection && styles.disableSelection,
          disableInteraction && styles.disableInteraction,
        )}
        ref={wrapperRef}
        style={
          {
            '--spacing': `${indentationWidth * depth}px`,
          } as React.CSSProperties
        }
        {...props}
      >
        <div
          className={clsx(
            styles.TreeItem,
            activeItem?.id === value && 'bg-white/10',
            'flex select-none items-center bg-transparent px-1 text-neutral-900 dark:text-white dark:hover:bg-white/5',
          )}
          ref={ref}
          style={style}
          {...handleProps}
        >
          {/* <Handle {...handleProps} /> */}
          {onCollapse && (
            <Action
              onClick={onCollapse}
              className={clsx(
                'transition-transform duration-300 ease-in-out',
                collapsed && '-rotate-90',
              )}
            >
              {collapseIcon}
            </Action>
          )}
          <div
            onClick={handleClickDir}
            className="flex w-full items-center justify-center gap-1 pl-2"
          >
            {type === 'Repository' ? (
              <Squares2X2Icon className="h-3 w-3 opacity-75" />
            ) : type === 'Plate' ? (
              <InboxIcon className="h-3 w-3 opacity-75" />
            ) : type === 'Container' ? (
              <BeakerIcon className="h-3 w-3 opacity-75" />
            ) : null}
            <span
              className={clsx(
                styles.Text,
                'flex-grow overflow-hidden overflow-ellipsis whitespace-nowrap py-2  text-xs',
              )}
            >
              {value}
            </span>
          </div>

          {!clone && onRemove && <Remove onClick={onRemove} />}
          {clone && childCount && childCount > 1 ? (
            <span className={styles.Count}>{childCount}</span>
          ) : null}
        </div>
      </li>
    );
  },
);

const collapseIcon = (
  <svg width="10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 41">
    <path d="M30.76 39.2402C31.885 40.3638 33.41 40.995 35 40.995C36.59 40.995 38.115 40.3638 39.24 39.2402L68.24 10.2402C69.2998 9.10284 69.8768 7.59846 69.8494 6.04406C69.822 4.48965 69.1923 3.00657 68.093 1.90726C66.9937 0.807959 65.5106 0.178263 63.9562 0.150837C62.4018 0.123411 60.8974 0.700397 59.76 1.76024L35 26.5102L10.24 1.76024C9.10259 0.700397 7.59822 0.123411 6.04381 0.150837C4.4894 0.178263 3.00632 0.807959 1.90702 1.90726C0.807714 3.00657 0.178019 4.48965 0.150593 6.04406C0.123167 7.59846 0.700153 9.10284 1.75999 10.2402L30.76 39.2402Z" />
  </svg>
);
