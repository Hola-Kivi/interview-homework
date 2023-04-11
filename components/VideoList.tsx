import Link from 'next/link';
import Image from 'next/image';
import { Video } from '@prisma/client';
import data1 from '@/prisma/staticData.json' assert { type: 'json' };

type PropList = {
  lang: string;
  data?: Video[];
};

function VideoItem() {
  return (
    <div className="group relative overflow-hidden border-4 border-white/50 rounded-xl">
      <Link href="#" className="">
        <div className="z-10 group-hover:bg-black/70 w-full h-full absolute transition-all duration-300"></div>
      </Link>
      <Image
        src="https://gcdp.oss-cn-qingdao.aliyuncs.com/201603/3/1457033189999_9093.jpg"
        alt="Picture of the author"
        width={700}
        height={400}
        priority
        object-contain="true"
        className="group-hover:scale-125 transition-all duration-500"
      />

      <div className="z-20 absolute -bottom-full left-12 group-hover:bottom-24 transition-all duration-500">
        <span className="text-gradient">demo</span>
      </div>
      <div className="z-20 absolute -bottom-full left-12 group-hover:bottom-14 transition-all duration-700">
        <span className="text-3xl text-white">demo</span>
      </div>
    </div>
  );
}

export default function VideoList() {
  return (
    <ul className="">
      {data1.lectures.slice(0, 2).map((item) => (
        <li key={item.id} className="list-none  overflow-x-auto">
          <VideoItem />
        </li>
      ))}
    </ul>
  );
}
