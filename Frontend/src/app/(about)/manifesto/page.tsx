'use client';

import Logo from '@/@brand/Logo';
import { useTranslation } from 'react-i18next';

export default function Page() {
  const { t } = useTranslation('manifesto');
  return (
    <div className=" relative  px-6 py-32  lg:px-8">
      {/* Background */}
      <div
        className="absolute inset-x-0 bottom-4 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[1108/632] w-[69.25rem] flex-none bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-25"
          style={{
            clipPath:
              'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
          }}
        />
      </div>

      {/* Background */}
      <div
        className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
        aria-hidden="true"
      >
        <div
          className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              'polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700 dark:text-gray-300">
        <div className="flex items-center gap-x-4 ">
          <Logo className="h-10 w-auto" />
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {t('title')}
          </h1>
        </div>

        <div className="mt-16 max-w-2xl">
          <h2 className="border-l-2 border-neutral-800 pl-5 text-2xl font-bold tracking-tight text-gray-900 dark:border-neutral-100 dark:text-white">
            {t('topic1.title')}
          </h2>
          <p className="mt-6 text-justify">{t('topic1.content')}</p>
        </div>

        <div className="mt-16 max-w-2xl">
          <h2 className="border-l-2 border-neutral-800 pl-5 text-2xl font-bold tracking-tight text-gray-900 dark:border-neutral-100 dark:text-white">
            {t('topic2.title')}
          </h2>
          <p className="mt-6 text-justify">{t('topic2.content')}</p>
        </div>
        <div className="mt-16 max-w-2xl">
          <h2 className="border-l-2 border-neutral-800 pl-5 text-2xl font-bold tracking-tight text-gray-900  dark:border-neutral-100 dark:text-white">
            {t('topic3.title')}
          </h2>
          <p className="mt-6 text-justify">{t('topic3.content')}</p>
        </div>
        <div className="mt-16 max-w-2xl">
          <h2 className="border-l-2 border-neutral-800 pl-5 text-2xl font-bold tracking-tight  text-gray-900 dark:border-neutral-100 dark:text-white">
            {t('topic4.title')}
          </h2>
          <p className="mt-6 text-justify">{t('topic4.content1')}</p>
          <p className="mt-8 text-justify">{t('topic4.content2')}</p>
          <p className="mt-8 text-justify">{t('topic4.content3')}</p>
        </div>
        <div className="mt-16 max-w-2xl">
          <h2 className="border-l-2 border-neutral-800 pl-5 text-2xl font-bold tracking-tight  text-gray-900 dark:border-neutral-100 dark:text-white">
            {t('topic5.title')}
          </h2>
          <p className="mt-6 text-justify">{t('topic5.content1')}</p>
          <p className="mt-8 text-justify">{t('topic5.content2')}</p>
          <p className="mt-8 text-justify">{t('topic5.content3')}</p>
          <p className="mt-8 text-justify">{t('topic5.content4')}</p>
          <p className="mt-8 text-justify">{t('topic5.content5')}</p>
        </div>
        <div className="mt-16 max-w-2xl">
          <h2 className="border-l-2 border-neutral-800 pl-5 text-2xl font-bold tracking-tight  text-gray-900 dark:border-neutral-100 dark:text-white">
            {t('topic6.title')}
          </h2>
          <p className="mt-6 text-justify">{t('topic6.content1')}</p>
          <p className="mt-8 text-justify">{t('topic6.content2')}</p>
          <p className="mt-8 text-justify">{t('topic6.content3')}</p>
        </div>
      </div>
    </div>
  );
}
