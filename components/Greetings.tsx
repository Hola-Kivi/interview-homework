import { ValidLocale } from '@/i18n/i18n-config';
import { getTranslation } from '@/i18n/getDictionary';

import Card from '@/components/Card';
import { langProps } from '@/lib/Types';

const getScript = async (lang: ValidLocale) => {
  const translate = await getTranslation(lang);

  const greetings = {
    hello: translate('greeting.hello'),
    note: translate('greeting.note'),
    schedule: translate('greeting.schedule'),
  };
  return greetings;
};

const Greetings = async ({ lang, user }: langProps) => {
  const greetings = await getScript(lang || 'en');

  return (
    <Card className="w-full py-4 flex items-center">
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
