import Link from 'next/link';
import Image from 'next/image';
import { Video } from '@prisma/client';
import data1 from '../prisma/staticData.json' assert { type: 'json' };

type Props = {
  lang: string;
  item: {
    id: string;
    title: string;
    cover: string;
    url: string;
    videoId: string;
  };
  horizontal?: boolean;
};
type PropList = {
  lang: string;
  data?: Video[];
};

function VideoItem({ lang, item, horizontal = true }: Props) {
  return (
    <div className="group relative overflow-hidden border-4 border-white/50 rounded-xl">
      {/* overlay-z-10 */}
      <Link href="#" className="">
        <div className="z-10 group-hover:bg-black/70 w-full h-full absolute transition-all duration-300"></div>
      </Link>
      {/* img */}
      <Image
        src="https://gcdp.oss-cn-qingdao.aliyuncs.com/201603/3/1457033189999_9093.jpg"
        alt="Picture of the author"
        width={700}
        height={400}
        priority
        object-contain="true"
        className="group-hover:scale-125 transition-all duration-500"
      />

      {/* pre-title-z-20 */}
      <div className="z-20 absolute -bottom-full left-12 group-hover:bottom-24 transition-all duration-500">
        <span className="text-gradient">234</span>
      </div>
      {/* title-z-20 */}
      <div className="z-20 absolute -bottom-full left-12 group-hover:bottom-14 transition-all duration-700">
        <span className="text-3xl text-white">234</span>
      </div>
    </div>
  );
}

export default function VideoList({ lang }: PropList) {
  return (
    <ul className="">
      {data1.lectures.slice(0, 2).map((item) => (
        <li key={item.id} className="list-none  overflow-x-auto">
          <VideoItem lang={lang} item={item} />
        </li>
      ))}
    </ul>
  );
}
