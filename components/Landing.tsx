import Image from 'next/image';
import Link from 'next/link';
import Button from './Button';

type dictionaryType = {
  dictionary: {
    main1: string;
    main2: string;
    main3: string;
    cta: string;
  };
};

export default function Landing({ dictionary }: dictionaryType) {
  return (
    <section className="sticky top-0 mx-auto flex h-screen max-w-[1350px] items-center justify-between px-8 overlay">
      <div className="space-y-8">
        <h1 className="space-y-3 text-5xl font-semibold tracking-wide lg:text-6xl xl:text-7xl">
          <span className="block bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
            {dictionary.main1}
          </span>
          <span className="block">{dictionary.main2}</span>
          <span className="block">{dictionary.main3}</span>
        </h1>

        <div className="space-x-8">
          <Link href="#">
            <Button
              intent="text"
              className="underline underline-offset-4 decoration-2"
            >
              {dictionary.cta}
            </Button>
          </Link>
        </div>
      </div>
      <div className="relative hidden md:block">
        <Image
          src="/landingPage.webp"
          width={600}
          height={600}
          alt="landingPage"
          priority
          className="rounded-xl"
        />
      </div>
    </section>
  );
}
