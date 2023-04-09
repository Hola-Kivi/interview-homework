import { cookies } from 'next/headers';

import { db } from '@/lib/db';
import { delay } from '@/lib/async';
import { getUserFromCookie } from '@/lib/auth';

import JSONLD from '@/seo/JSONLD';
import { ValidLocale } from '@/i18n/i18n-config';
import { getRootScript, langSwitcher } from '@/i18n/rootPage';

import CTA from '@/components/CTA';
import Card from '@/components/Card';
import Header from '@/components/Header';
import VideoList from '@/components/VideoList';
import PostCard from '@/components/PostCard';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import Marquee from '@/components/Marquee';

const getData = async () => {
  // await delay(3500);

  let user = await getUserFromCookie(cookies());
  let videos = await db.video.findMany({
    where: {
      userId: user?.id,
    },
    take: 2,
  });

  return { videos, user };
};
const getVideo = async (userId: string) => {
  // await delay(3500);

  let video = await db.video.findFirst({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      videoURL: true,
    },
  });
  return video?.videoURL;
};

const splitExt = (url: string) => {
  let file = url.slice(url.lastIndexOf('/') + 1, url.length);
  let filename = file.slice(0, file.lastIndexOf('.'));

  return filename;
};

export const repsList = [
  {
    id: 'Annette Watson',
    src: 'https://randomuser.me/api/portraits/women/82.jpg',
    alt: 'Annette Watson profile picture',
    name: 'Annette Watson',
    rate: '9.3',
  },
  {
    id: 'Calvin Steward',
    src: 'https://randomuser.me/api/portraits/men/81.jpg',
    alt: 'Calvin Steward profile picture',
    name: 'Calvin Steward',
    rate: '8.9',
  },
  {
    id: 'Ralph Richards',
    src: 'https://randomuser.me/api/portraits/men/80.jpg',
    alt: 'Ralph Richards profile picture',
    name: 'Ralph Richards',
    rate: '8.7',
  },
  {
    id: 'Bernard Murphy',
    src: 'https://randomuser.me/api/portraits/men/79.jpg',
    alt: 'Bernard Murphy profile picture',
    name: 'Bernard Murphy',
    rate: '8.2',
  },
  {
    id: 'Arlene Robertson',
    src: 'https://randomuser.me/api/portraits/women/78.jpg',
    alt: 'Arlene Robertson profile picture',
    name: 'Arlene Robertson',
    rate: '8.2',
  },
  {
    id: 'Jane Lane',
    src: 'https://randomuser.me/api/portraits/women/77.jpg',
    alt: 'Jane Lane profile picture',
    name: 'Jane Lane',
    rate: '8.1',
  },
  {
    id: 'Pat Mckinney',
    src: 'https://randomuser.me/api/portraits/men/76.jpg',
    alt: 'Pat Mckinney profile picture',
    name: 'Pat Mckinney',
    rate: '7.9',
  },
  {
    id: 'Norman Walters',
    src: 'https://randomuser.me/api/portraits/men/75.jpg',
    alt: 'Norman Walters profile picture',
    name: 'Norman Walters',
    rate: '7.7',
  },
];

export default async function Page({
  params: { lang },
}: {
  params: { lang: ValidLocale };
}) {
  const textList = [
    '你好世界',
    'Hello World',
    'こんにちは世界',
    'Ciao mondo',
    '헬로 월드',
    'Hello Mundo',
    'Hallo Welt',
    'สวัสดีชาวโลก',
    'Molo Lizwe',
    'Chào thế giới',
    'مرحبا بالعالم',
  ];

  const rootTranscript = await getRootScript(lang);
  const { user, videos } = await getData();

  if (!user) return;
  const path = await getVideo(user.id);

  let field: string | boolean;
  if (typeof path === 'string') {
    field = splitExt(path);
  } else {
    field = false;
  }
  return (
    <div className="h-full overflow-y-auto px-2">
      {/* header-manu */}
      <Header
        userId={user.firstName}
        lang={lang}
        langsIcon={langSwitcher}
        headerTranscript={rootTranscript.common}
      />
      <main className="p-4 space-y-6">
        {/* sec-dash */}
        <section>
          <CTA rootCTA={rootTranscript.rootPage} lang={lang} />
        </section>
        {/* sec-panel */}
        <section className="grid md:grid-cols-2 gap-3">
          {rootTranscript.secContent.map((sec) => (
            <Card key={sec.id} className="flex items-center">
              <div
                className={classNames(
                  'flex items-center justify-center h-16 mr-6 caret-indigo-500',
                  sec.textColor
                )}
              >
                <sec.svg />
              </div>
              <div>
                <span className="block md:text-xl font-bold">{sec.stats}</span>
                <span className="block text-sm md:text-base text-gray-500">
                  {sec.transcript}
                </span>
              </div>
            </Card>
          ))}
        </section>
        {/* 在线课堂 */}
        <section className="flex items-center">
          <Card className="mx-auto px-6 py-4">
            <div className="flex flex-col gap-y-2 lg:flex-row lg:gap-x-10">
              <div className="flex-1 flex flex-col gap-y-2 lg:gap-y-10">
                {/* text */}
                <div className="grow flex flex-col sm:flex-row sm:items-center md:items-center justify-between">
                  <div className="lg:ml-4">
                    <h2 className="text-3xl tracking-[10%] uppercase mb-2 text-accent lg:text-5xl lg:mb-6 xl:text-6xl xl:mb-6">
                      美国在线课堂 <br />
                      -数学
                    </h2>
                    <p className="max-w-xs text-xs mb-2 md:mb-4 lg:mb-0 lg:text-sm  xl:text-base xl:mb-6">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Dolorum, modi asperiores excepturi!
                    </p>
                  </div>
                  <Link
                    href={`/${lang}/post/3821622d-45f1-4c0a-885a-80dfb7acf8eb`}
                  >
                    <button className="btn btn-xs ml-auto md:btn-sm xl:btn-lg">
                      View all courses
                    </button>
                  </Link>
                </div>
                {/* image */}
                <div className="group relative overflow-hidden border-4 border-white/50 rounded-xl">
                  {/* overlay-z-10 */}
                  <Link
                    href={`/${lang}/post/3821622d-45f1-4c0a-885a-80dfb7acf8eb`}
                  >
                    <div className="z-10 group-hover:bg-black/70 w-full h-full absolute transition-all duration-300"></div>
                    {/* img */}
                  </Link>
                  <Image
                    src="https://gcdp.oss-cn-qingdao.aliyuncs.com/201603/3/1457032987406_6451.jpg"
                    alt="Picture of the author"
                    width={700}
                    height={400}
                    priority
                    object-contain="true"
                    className=" group-hover:scale-125 transition-all duration-500"
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
              </div>
              <div className="flex-1 flex flex-col gap-y-2 lg:gap-y-10">
                <VideoList data={videos} lang={lang} />
              </div>
            </div>
          </Card>
        </section>
        {/* 多语言 */}
        <section className="">
          <h2 className="text-2xl font-medium tracking-wide text-center mt-4">
            支持多语言
          </h2>
          <Card className="overflow-x-hidden flex justify-center items-center">
            <Marquee
              className="py-1 md:py-6 whitespace-nowrap"
              gradientColor="#F8FBFD"
              gradientWidth={100}
              onHover
            >
              {textList.map((item) => (
                <span key={item} className="mx-8 text-4xl">
                  {item}
                </span>
              ))}
            </Marquee>
          </Card>
        </section>
        {/* sec-rep-sharing */}
        <section className="w-5/6 mx-auto mt-10">
          <Card className="">
            <PostCard src={field} userId={user.id} />
          </Card>
        </section>
      </main>
      <JSONLD />
    </div>
  );
}
