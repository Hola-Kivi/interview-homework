'use client';

import React, { useEffect, useRef } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import useSWRInfinite from 'swr/infinite';

import { Chapter, Video } from '@prisma/client';
import useOnScreen from '@/lib/useOnScreen';

type Result = { data: Chapter[]; nextCursor: string };
type Props = {
  video: Video;
};
const getKey = (
  pageIndex: number,
  previousPageData: {
    data: [];
    nextCursor: string;
  },
  videoId: string
) => {
  if (previousPageData && !previousPageData.data) return null;

  if (pageIndex === 0) return `/api/chapter?videoId=${videoId}`;

  return `/api/chapter?cursor=${previousPageData.nextCursor}&videoId=${videoId}`;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function VideoLink({ video }: Props) {
  const ref: any = useRef<HTMLDivElement>();
  const onScreen: boolean = useOnScreen<HTMLDivElement>(ref);

  const { data, error, size, setSize } = useSWRInfinite<Result>(
    (...args) => getKey(...args, video?.id),
    fetcher,
    {
      revalidateFirstPage: false,
    }
  );

  const hasNext = data && data[data.length - 1].nextCursor;
  const isLoadingInitialData = !data && !error;

  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined');

  useEffect(() => {
    if (onScreen && hasNext) {
      setSize(size + 1);
    }
  }, [onScreen, hasNext]);

  return (
    <>
      <main className="grid min-h-screen grid-cols-2 md:grid-cols-4 gap-4">
        {data &&
          data.map((pageData, index) => {
            return pageData.data.map((item) => (
              <div
                className="ring-1 ring-gray-200 p-2 flex flex-col justify-center"
                key={item.id}
              >
                <Link href={`/post/chapter/${item.id}`}>
                  <Image
                    src={item.cover ?? ''}
                    width={700}
                    height={400}
                    alt={item.title ?? ''}
                    object-contain="true"
                  />
                  <div className="mt-2 h-12 text-ellipsis overflow-hidden text-xs md:text-base">
                    {item.title}
                  </div>
                </Link>
              </div>
            ));
          })}
      </main>
      <div className="text-center p-3" ref={ref}>
        {isLoadingMore ? 'Loading...' : hasNext ? '加载更多' : '没有数据了'}
      </div>
    </>
  );
}
