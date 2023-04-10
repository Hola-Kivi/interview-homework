import { FC, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {}

const Carousel: FC<Props> = ({ className, children }) => {
  return (
    <>
      <div className="carousel-item text-center relative w-64 h-64 snap-start">
        <div className="h-full w-full aspect-square bg-origin-padding bg-left-top bg-cover bg-no-repeat z-0 flex">
          {children}
        </div>
        <div className="h-full w-full aspect-square block absolute top-0 left-0 transition-opacity duration-300 opacity-0 hover:opacity-100 bg-blue-800/75 z-10">
          456
        </div>
      </div>
    </>
  );
};

export default Carousel;
