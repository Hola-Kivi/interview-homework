'use client';

import classNames from 'classnames';
import React, {
  FC,
  HTMLAttributes,
  PropsWithChildren,
  ReactElement,
  useState,
} from 'react';
import { useEffect } from 'react';
import Button from './Button';

interface Props extends HTMLAttributes<HTMLDivElement> {}

type widthType = { width?: string };
type ItemProps = PropsWithChildren<widthType>;

export const CarouselItem = ({ children, width }: ItemProps) => {
  return (
    <div className="inline-flex justify-center" style={{ width: width }}>
      {children}
    </div>
  );
};

const Carousel: FC<Props> = ({ children, className }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const updateIndex = (newIndex: number) => {
    if (newIndex < 0) {
      newIndex = React.Children.count(children) - 1;
    } else if (newIndex >= React.Children.count(children)) {
      newIndex = 0;
    }

    setActiveIndex(newIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!paused) {
        updateIndex(activeIndex + 1);
      }
    }, 3500);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  });

  return (
    <div
      className={(classNames(''), className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="whitespace-nowrap duration-75"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {React.Children.map(children, (child) => {
          return React.cloneElement(child as ReactElement, { width: '100%' });
        })}
      </div>

      <div className="text-center mt-2">
        <Button
          intent="text"
          className="font-extralight text-base !px-0 mr-1"
          onClick={() => {
            updateIndex(activeIndex - 1);
          }}
        >
          Prev
        </Button>

        {React.Children.map(children, (child, index) => {
          return (
            <Button
              intent="text"
              size="small"
              className={classNames(
                'text-xs underline',
                index === activeIndex ? '!text-base' : ''
              )}
              onClick={() => {
                updateIndex(index);
              }}
            >
              {index + 1}
            </Button>
          );
        })}

        <Button
          intent="text"
          className="font-extralight text-base !px-0 ml-1"
          onClick={() => {
            updateIndex(activeIndex + 1);
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Carousel;
