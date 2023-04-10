'use client';

import { useEffect, useRef } from 'react';
import NewPost from '@/components/NewPost';

type postParams = {
  src: string | boolean;
  userId: string;
};

const PostCard = ({ src, userId }: postParams) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const apiPath = src ? `/api/player/${src}` : '';

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute('src');
      videoRef.current.load();
    }
  });

  return (
    <>
      <NewPost userId={userId} />

      {apiPath ? (
        <video
          ref={videoRef}
          className="rounded-xl h-[462px] mt-16"
          controls
          loop
          autoPlay
          muted
        >
          <source src={apiPath} type="video/mp4" />
        </video>
      ) : (
        ''
      )}
    </>
  );
};

export default PostCard;
