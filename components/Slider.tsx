'use client';

import { useState, useRef, useEffect, FC, HTMLAttributes } from 'react';
import Carousel from './Carousel';

interface Props extends HTMLAttributes<HTMLDivElement> {}

const Slider: FC<Props> = ({ className, children }) => {
  const maxScrollWidth = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carousel = useRef<HTMLDivElement>(null);

  const movePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevState) => prevState - 1);
    }
  };

  const moveNext = () => {
    if (
      carousel.current !== null &&
      carousel.current.offsetWidth * currentIndex <= maxScrollWidth.current
    ) {
      setCurrentIndex((prevState) => prevState + 1);
    }
  };

  const isDisabled = (direction: string) => {
    if (direction === 'prev') {
      return currentIndex <= 0;
    }

    if (direction === 'next' && carousel.current !== null) {
      return (
        carousel.current.offsetWidth * currentIndex >= maxScrollWidth.current
      );
    }

    return false;
  };

  useEffect(() => {
    if (carousel !== null && carousel.current !== null) {
      carousel.current.scrollLeft = carousel.current.offsetWidth * currentIndex;
    }
  }, [currentIndex]);

  useEffect(() => {
    maxScrollWidth.current = carousel.current
      ? carousel.current.scrollWidth - carousel.current.offsetWidth
      : 0;
  }, []);

  return (
    <div className="my-12 mx-auto">
      <h2 className="text-4xl leading-8 font-semibold mb-12 text-slate-700">
        Our epic carousel
      </h2>
      <div className="relative overflow-hidden">
        <div className="carousel-container relative overflow-hidden scroll-smooth snap-x snap-mandatory touch-pan-x z-0">
          <Carousel>{children}</Carousel>
        </div>
      </div>
    </div>
  );
};

export default Slider;
