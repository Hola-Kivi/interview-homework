import Link from 'next/link';
import Image from 'next/image';
import { cookies } from 'next/headers';
import classNames from 'classnames';

import { db } from '@/lib/db';
import { langProps } from '@/lib/Types';
import { splitExt } from '@/lib/splitExt';
import { getUserFromCookie } from '@/lib/auth';

import JSONLD from '@/seo/JSONLD';
import { textList } from '@/i18n/i18n-config';
import { getRootScript, langSwitcher } from '@/i18n/rootPage';

import CTA from '@/components/CTA';
import Card from '@/components/Card';
import Header from '@/components/Header';
import Marquee from '@/components/Marquee';
import PostCard from '@/components/PostCard';
import VideoList from '@/components/VideoList';

const getVideo = async () => {
  let user = await getUserFromCookie(cookies());

  let video = await db.video.findFirst({
    where: {
      userId: user?.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      videoURL: true,
    },
  });
  return { video, user };
};

export default async function Page({ params }: langProps) {
  const rootTranscript = await getRootScript(params.lang);

  let path;
  const { video, user } = await getVideo();
  if (!user) return;
  if (!video?.videoURL) return (path = '');

  path = splitExt(video?.videoURL);

  return (
    <div className="h-full overflow-y-auto scrollbar-hide px-2">
      {/* header-manu */}
      <Header
        userId={user.firstName}
        lang={params.lang}
        langsIcon={langSwitcher}
        headerTranscript={rootTranscript.common}
      />
      <main className="p-4 space-y-6">
        {/* sec-CTA */}
        <section>
          <CTA rootCTA={rootTranscript.rootPage} lang={params.lang} />
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
                    href={`/${params.lang}/post/2a29014d-e33b-4073-b21d-018bb3d6b435`}
                  >
                    <button className="btn btn-xs ml-auto md:btn-md xl:btn-lg">
                      View all courses
                    </button>
                  </Link>
                </div>
                {/* image */}
                <div className="group relative overflow-hidden border-4 border-white/50 rounded-xl">
                  {/* overlay-z-10 */}
                  <Link href={`#`}>
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
                <VideoList lang={params.lang} />
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
            <PostCard src={path} userId={user.id} />
          </Card>
        </section>
      </main>
      <JSONLD />
    </div>
  );
}
