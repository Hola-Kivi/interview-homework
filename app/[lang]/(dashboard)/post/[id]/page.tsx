import { cookies } from 'next/headers';

import { getUserFromCookie } from '@/lib/auth';
import { db } from '@/lib/db';

import { beSerializable } from '@/lib/beSerializable';
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
  const video = await getData('3f2246d7-ff40-46c7-a992-13315314a30c');
  if (!video) return;

  return (
    <div className="h-full overflow-y-auto pr-6 w-full mx-4">
      <div className="max-w-5xl px-3 mx-auto pb-5">
        <h1 className="text-3xl my-4 text-center">三角比</h1>
        <div className="p-3">
          还在为三角函数的定义、记忆和解答而发懵？Sal用简洁的讲解迅速破解了还提供了助记方法，一起来看看吧
        </div>
      </div>
      <div>
        <VideoLink video={video} />
      </div>
    </div>
  );
}
