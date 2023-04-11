import VideoLink from '@/components/VideoLink';
import dummyData from '@/prisma/staticData.json' assert { type: 'json' };

export default async function Page() {
  return (
    <div className="h-full overflow-y-auto pr-6 w-full mx-4">
      <div className="max-w-5xl px-3 mx-auto pb-5">
        <h1 className="text-3xl my-4 text-center">
          {dummyData.lectures[0].title}
        </h1>
        <div className="p-3">
          还在为三角函数的定义、记忆和解答而发懵？Sal用简洁的讲解迅速破解了还提供了助记方法，一起来看看吧
        </div>
      </div>
      <div>
        <VideoLink video={dummyData.lectures[0]} />
      </div>
    </div>
  );
}
