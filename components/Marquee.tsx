import classNames from 'classnames';
import React, { CSSProperties, FC, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  delay?: CSSProperties['animationDelay'];
  direction?: 'left' | 'right';
  gradientColor?: string;
  gradientWidth?: CSSProperties['width'];
  speed?: number;
  onHover?: boolean;
}

const Marquee: FC<Props> = ({
  className,
  children,
  delay,
  direction = 'left',
  gradientColor,
  gradientWidth,
  speed,
  onHover,
}: Props) => {
  const contentStyles: CSSProperties = {
    animationDelay: `${delay}`,
    animationDirection: direction === 'right' ? 'reverse' : undefined,
  };

  return (
    <>
      <div
        className={classNames('relative animate-none', onHover && 'p-marquee')}
      >
        <div className={classNames('marquee', className)} style={contentStyles}>
          {children}
        </div>

        <div
          className={classNames(
            'absolute top-0 marquee2 text-lime-500',
            className
          )}
          style={contentStyles}
        >
          {children}
        </div>
      </div>
      {gradientColor && (
        <>
          <div
            className="marquee-overlay marquee-overlay-left"
            style={{
              background: `linear-gradient(90deg, ${gradientColor} 0%, rgba(255, 255, 255, 0) 100%)`,
              width: gradientWidth,
            }}
          ></div>
          <div
            className="marquee-overlay marquee-overlay-right"
            style={{
              background: `linear-gradient(270deg, ${gradientColor} 0%, rgba(255, 255, 255, 0) 100%)`,
              width: gradientWidth,
            }}
          ></div>
        </>
      )}
    </>
  );
};

export default Marquee;
