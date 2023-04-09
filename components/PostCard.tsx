'use client';

import { useEffect, useRef } from 'react';
import NewPost from '@/components/NewPost';

type postParams = {
  src: string | boolean;
  userId: string;
};

const PostCard = ({ src, userId }: postParams) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const apiPath = typeof src === 'string' ? `/api/player/${src}` : false;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute('src');
      videoRef.current.load();
    }
  });

  return (
    <>
      {typeof apiPath === 'string' ? (
        <video
          ref={videoRef}
          className="rounded-xl h-[462px] mt-16 bg-black"
          controls
          loop
          autoPlay
          muted
        >
          <source src={apiPath} type="video/mp4" />
        </video>
      ) : (
        <NewPost userId={userId} />
      )}
    </>
  );
};

export default PostCard;
