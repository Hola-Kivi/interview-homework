import { getTranslation } from '@/i18n/getDictionary';
import { ValidLocale } from '@/i18n/i18n-config';

import AuthForm from '@/components/Authform';
import LocaleHeader from '@/components/LocaleHeader';
import Landing from '@/components/Landing';
import { langSwitcher } from '@/i18n/rootPage';
import { langProps } from '@/lib/Types';

const getScript = async (lang: ValidLocale) => {
  const translate = await getTranslation(lang as ValidLocale);

  const registerContent = {
    linkUrl: `/${lang}/login`,
    linkText: translate('registerContent.linkText'),
    header: translate('registerContent.header'),
    subheader: translate('registerContent.subheader'),
    buttonText: translate('registerContent.buttonText'),
    firstName: translate('inputInfo.firstName'),
    lastName: translate('inputInfo.lastName'),
    email: translate('inputInfo.email'),
    password: translate('inputInfo.password'),
  };
  const landingContent = {
    main1: translate('landingText.main1'),
    main2: translate('landingText.main2'),
    main3: translate('landingText.main3'),
    cta: translate('landingText.cta'),
  };

  const navContent = {
    product: translate('navContent.product'),
    support: translate('navContent.support'),
    explore: translate('navContent.explore'),
    business: translate('navContent.business'),
  };

  return { registerContent, landingContent, navContent };
};

export default async function Register({ params }: langProps) {
  const { registerContent, landingContent, navContent } = await getScript(
    params.lang
  );

  return (
    <div className="h-full overflow-y-auto">
      <LocaleHeader langsIcon={langSwitcher} dictionary={navContent} />
      <main className="relative h-[200vh]">
        <Landing dictionary={landingContent} />
      </main>
      <section className="relative z-40 -mt-[100vh] min-h-screen rounded-2xl flex items-center justify-center rainbow-mesh">
        <AuthForm
          mode="register"
          dictionary={registerContent}
          lang={params.lang}
        />
      </section>
    </div>
  );
}
