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
        className={clsx(styles.Action, className)}
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
