import { cookies } from 'next/headers';
import { ValidLocale } from '@/i18n/i18n-config';
import { getTranslation } from '@/i18n/getDictionary';

import { delay } from '@/lib/async';
import { langProps } from '@/lib/Types';
import { getUserFromCookie } from '@/lib/auth';
import Card from '@/components/Card';

const getScript = async (lang: ValidLocale) => {
  const translate = await getTranslation(lang);

  const greetings = {
    hello: translate('greeting.hello'),
    note: translate('greeting.note'),
    schedule: translate('greeting.schedule'),
  };
  return greetings;
};
const getData = async () => {
  await delay(3500);

  let user = await getUserFromCookie(cookies());

  return user;
};

const Greetings = async ({ lang }: langProps) => {
  const greetings = await getScript(lang || 'en');
  const user = await getData();

  return (
    <Card className="w-full py-4 flex items-center relative">
      <div className="text-start">
        <h1 className="text-xl md:text-2xl text-gray-700 font-bold mb-2">
          {greetings.hello} {user?.firstName}!
        </h1>
        <h4 className="text-xs md:text-lg text-gray-500 tracking-tight max-w-xs">
          {greetings.note}
        </h4>
      </div>
      <div className="ml-auto">
        <button className="btn btn-xs md:btn-lg">{greetings.schedule}</button>
      </div>
    </Card>
  );
};

export default Greetings;
