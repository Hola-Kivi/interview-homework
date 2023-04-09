import { HTMLAttributes } from 'react';

import classNames from 'classnames';

interface Props extends HTMLAttributes<HTMLDivElement> {}

const Card = ({ className, children }: Props) => {
  return (
    <div
      className={classNames(
        'rounded-2xl px-2 drop-shadow-xl border-4  border-x-purple-500 hover:border-y-white transition-colors duration-300 ease-in-out',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
