import { cookies } from 'next/headers';

import { getUserFromCookie } from '@/lib/auth';
import { db } from '@/lib/db';

import { beSerializable } from '@/lib/beSerializable';
import Image from 'next/image';
import VideoLink from '@/components/VideoLink';
import { NextApiRequest } from 'next';
import { ValidLocale } from '@/i18n/i18n-config';

export interface VideoProps extends NextApiRequest {
  params: {
    lang: ValidLocale;
    id: string;
  };
}

const getData = async (id: string) => {
  const user = await getUserFromCookie(cookies());

  const videos = await db.video.findFirst({
    where: { id, userId: user?.id },
  });
  return beSerializable(videos);
};

export default async function Page(req: VideoProps) {
  const video = await getData(req.params.id);
  if (!video) return;

  return (
    <div className="h-full overflow-y-auto pr-6 w-full">
      <div className="max-w-5xl px-3 mx-auto pb-5">
        <h1 className="text-3xl my-4 text-center">{video.name}</h1>
        <div className="text-center">
          <Image
            src={video.pic ?? ''}
            width={320}
            height={180}
            alt={video.name ?? ''}
          />
        </div>
        <div className="p-3">{video.description}</div>
        <h2 className="text-xl my-2">章节视频</h2>
      </div>
      <div>
        <>
          <VideoLink video={video} />
        </>
      </div>
    </div>
  );
}
