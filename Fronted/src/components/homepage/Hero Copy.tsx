import Loading from '@/app/loading';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LogoBanner } from '../../@brand/Logo';
export default function Hero() {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <>
      {isLoading ? (
        <div className=" absolute z-50 h-screen w-screen bg-white dark:bg-neutral-900">
          <Loading />
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-950">
          <div className="relative isolate px-6 pt-14 lg:px-8">
            <div
              className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
              aria-hidden="true"
            >
              <div
                className={`relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]`}
                style={{
                  clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
              />
            </div>
            <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-32">
              <div className="text-center">
                <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                  <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 duration-300 hover:scale-105 hover:ring-gray-900/20 dark:text-gray-400 dark:ring-gray-100/10 dark:hover:ring-gray-100/20">
                    {t('Find our latest feature update.')}
                    <Link
                      href="/login"
                      className="font-semibold text-indigo-600"
                    >
                      <span className="absolute inset-0" aria-hidden="true" />
                      {t('Read more')}
                      <span aria-hidden="true"> &rarr;</span>
                    </Link>
                  </div>
                </div>
                <h1 className="flex flex-col items-center text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl">
                  {/* <Logo className="mb-6 h-16 w-16 sm:h-20 sm:w-20 dark:fill-white fill-indigo-800" /> */}
                  <LogoBanner className="sm:h-120 mb-6 h-16 w-16 fill-indigo-800 dark:fill-white sm:w-auto" />
                  {t('hero.title')}
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                  {t('hero.description')}
                </p>

                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <button
                    type="button"
                    name="Get started"
                    title="Get started"
                    onClick={() => {
                      setIsLoading(true);
                      router.push('/dashboard');
                    }}
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    {t('hero.button.primary')}
                  </button>
                  <button
                    type="button"
                    name="Learn more"
                    title="Learn more"
                    onClick={() => {
                      router.push('/login');
                    }}
                    className="text-sm font-semibold leading-6 text-gray-900 duration-300 hover:translate-x-1 hover:scale-110  dark:text-gray-100"
                  >
                    <span className="" aria-hidden="true">
                      {t('hero.button.secondary')} →
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <div
              className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
              aria-hidden="true"
            >
              <div
                className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
