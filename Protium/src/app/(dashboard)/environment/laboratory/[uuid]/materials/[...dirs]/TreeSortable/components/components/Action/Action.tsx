import React, {forwardRef, CSSProperties} from 'react';

import styles from './Action.module.css';
import clsx from 'clsx';

export interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  active?: {
    fill: string;
    background: string;
  };
  cursor?: CSSProperties['cursor'];
}

export const Action = forwardRef<HTMLButtonElement, Props>(
  ({active, className, cursor, style, ...props}, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={clsx(styles.Action,
          "flex w-3 py-4 ml-2 items-center justify-center cursor-pointer rounded outline-none border-none bg-transparent",
          
          className)}
        tabIndex={0}
        style={
          {
            ...style,
            cursor,
            '--fill': active?.fill,
            '--background': active?.background,
          } as CSSProperties
        }
      />
    );
  }
);
