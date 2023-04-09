import { getUserFromCookie } from '@/lib/auth';
import { beSerializable } from '@/lib/beSerializable';
import { db } from '@/lib/db';
import { Chapter } from '@prisma/client';
import { cookies } from 'next/headers';
import { VideoProps } from '../../[id]/page';

type Props = {
  chapter: Chapter;
};

const getData = async (id: string) => {
  const user = await getUserFromCookie(cookies());

  const chapters = await db.chapter.findFirst({
    where: { id },
  });
  return beSerializable(chapters);
};

export default async function Page(req: VideoProps) {
  const chapter = await getData(req.params.id);
  if (!chapter) return;
  return (
    <div>
      <div className="aspect-video">
        <video
          width="100%"
          height="100%"
          src={chapter.url ?? ''}
          controls
          poster={chapter.cover ?? ''}
        >
          抱歉，您的浏览器不支持内嵌视频，不过不用担心，你可以
          <a href="videofile.ogg">下载</a>
          并用你喜欢的播放器观看！
        </video>
      </div>
      <div className="p-3">{chapter?.title}</div>
    </div>
  );
}
