'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { register, login } from '@/lib/api';

import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { ValidLocale } from '@/i18n/i18n-config';

const initial = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
};

type dictionaryType = {
  linkUrl: string;
  header: string;
  linkText: string;
  subheader: string;
  buttonText: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type authFormProps = {
  mode: 'register' | 'login';
  dictionary: dictionaryType;
  lang: ValidLocale;
};

export default function AuthForm({ mode, dictionary, lang }: authFormProps) {
  const [formState, setFormState] = useState({ ...initial });
  const [error, setError] = useState('');
  const [isLoading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setLoading(true);
      try {
        if (mode === 'register') {
          await register(formState);
        } else {
          await login(formState);
        }
        router.replace(`/${lang}`);
      } catch (e) {
        setError(`Could not ${mode}`);
      } finally {
        setLoading(false);
        setFormState({ ...initial });
      }
    },
    [
      formState.email,
      formState.password,
      formState.firstName,
      formState.lastName,
    ]
  );

  return (
    <Card className="glass flex items-center justify-center p-4 sm:px-6 sm:min-h-full lg:px-8 mt-8">
      <div className="max-w-lg space-y-8 mx-4">
        <div className="headings space-y-6">
          <h2 className="text-2xl md:text-4xl headings-title">
            {dictionary.header}
          </h2>
          <p className="text-md text-black/30 headings-text">
            {dictionary.subheader}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 rounded-2xl flex flex-col gap-y-2 pt-10 items-center"
        >
          {mode === 'register' && (
            <div className="flex mb-8 justify-between">
              <div className="pr-2">
                <div className="text-sm sm:text-lg mb-4 ml-2 text-black/80">
                  {dictionary.firstName}
                </div>
                <Input
                  required
                  placeholder="firstname"
                  value={formState.firstName}
                  className="border-solid border-gray border-2 px-4 py-2 text-sm rounded-3xl w-full"
                  onChange={(e) =>
                    setFormState((s) => ({ ...s, firstName: e.target.value }))
                  }
                />
              </div>
              <div className="pl-2">
                <div className="text-sm sm:text-lg mb-4 ml-2 text-black/80">
                  {dictionary.lastName}
                </div>
                <Input
                  required
                  placeholder="lastname"
                  value={formState.lastName}
                  className="border-solid border-gray border-2 px-6 py-2 text-sm rounded-3xl w-full"
                  onChange={(e) =>
                    setFormState((s) => ({ ...s, lastName: e.target.value }))
                  }
                />
              </div>
            </div>
          )}
          <div className="mb-8">
            <div className="text-sm sm:text-lg mb-2 ml-2 text-black/80">
              {dictionary.email}
            </div>
            <Input
              required
              type="email"
              placeholder="email"
              value={formState.email}
              className="border-solid border-gray border-2 px-6 py-2 text-sm sm:text-base rounded-3xl w-full"
              onChange={(e) =>
                setFormState((s) => ({ ...s, email: e.target.value }))
              }
            />
          </div>
          <div className="mb-8">
            <div className="text-sm sm:text-lg mb-2 ml-2 text-black/80">
              {dictionary.password}
            </div>
            <Input
              required
              type="password"
              placeholder="password"
              value={formState.password}
              className="border-solid border-gray border-2 px-6 py-2 text-sm sm:text-base rounded-3xl w-full"
              onChange={(e) =>
                setFormState((s) => ({ ...s, password: e.target.value }))
              }
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <div>
              <span>
                <Link
                  href={dictionary.linkUrl}
                  className="text-blue-600 font-bold"
                >
                  {dictionary.linkText}
                </Link>
              </span>
            </div>
            <div>
              <Button
                type="submit"
                intent="secondaryBorder"
                loading={isLoading}
              >
                {dictionary.buttonText}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Card>
  );
}
