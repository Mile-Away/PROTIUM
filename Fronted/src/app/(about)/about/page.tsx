"use client";
import Footer from '@/components/homepage/Footer';
import Navbar from '@/components/navbar/Navbar';
import { useTranslation } from 'react-i18next';


const timeline = [
  {
    name: 'history.title1',
    description: 'history.description1',
    date: 'Aug 2021',
    dateTime: '2021-08',
  },
  {
    name: 'history.title2',
    description: 'history.description2',
    date: 'Dec 2021',
    dateTime: '2021-12',
  },
  {
    name: 'history.title3',
    description: 'history.description3',
    date: 'Feb 2022',
    dateTime: '2022-02',
  },
];

export default function About() {
  const { t } = useTranslation('about');
  return (
    <div className="bg-white dark:bg-black">
      {/* Header */}
      <Navbar />

      <main className="isolate">
        {/* Hero section */}
        <div
          id="about"
          className="relative isolate -z-10 overflow-hidden bg-gradient-to-b from-indigo-100/20 pt-14 dark:from-indigo-950/20"
        >
          <div
            className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg]
             bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50
             dark:bg-black dark:shadow-indigo-200/10 dark:ring-1 dark:ring-indigo-950 sm:-mr-80 lg:-mr-96"
            aria-hidden="true"
          />
          <div className="mx-auto max-w-8xl px-6 py-32 sm:py-40 lg:px-8 2xl:max-w-screen-2xl">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8">
              <h1 className="sm:leading-12 max-w-2xl text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:col-span-2 xl:col-auto">
                {t('hero.title')}
              </h1>
              <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
                <p className="text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg sm:leading-8">
                  {t('hero.description')}
                </p>
              </div>
              <img
                src="/hero4-horizen.png"
                alt=""
                className="mt-10 aspect-[6/5] w-full max-w-lg rounded-2xl object-cover sm:mt-16 lg:mt-0 lg:max-w-none xl:row-span-2 xl:row-end-2 xl:mt-36"
              />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white dark:from-black sm:h-32" />
        </div>

        {/* Timeline section */}
        <div className="mx-auto -mt-8 max-w-8xl px-6 lg:px-8 2xl:max-w-screen-2xl">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 overflow-hidden lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {timeline.map((item) => (
              <div key={item.name}>
                <time
                  dateTime={item.dateTime}
                  className="flex items-center text-sm font-semibold leading-6 text-indigo-600 dark:text-indigo-400"
                >
                  <svg
                    viewBox="0 0 4 4"
                    className="mr-4 h-1 w-1 flex-none"
                    aria-hidden="true"
                  >
                    <circle cx={2} cy={2} r={2} fill="currentColor" />
                  </svg>
                  {t(item.date)}
                  <div
                    className="absolute -ml-2 h-px w-screen -translate-x-full bg-gray-900/10 dark:bg-white/20 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"
                    aria-hidden="true"
                  />
                </time>
                <p className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900 dark:text-white">
                  {t(item.name)}
                </p>
                <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {t(item.description)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Content section */}
        <div className="overflow-hidden pt-32 sm:pt-40">
          <div className="mx-auto max-w-8xl px-6 lg:flex lg:px-8 2xl:max-w-screen-2xl">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-12 gap-y-16 lg:mx-0 lg:min-w-full lg:max-w-none lg:flex-none lg:gap-y-8">
              <div className="lg:col-end-1 lg:w-full lg:max-w-xl lg:pb-8 ">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  {t('vision.title')}
                </h2>
                <p className="mt-6 text-base leading-6 text-gray-600 dark:text-gray-300">
                  {t('vision.description1')}
                </p>
                <p className="mt-6 text-base leading-6 text-gray-600 dark:text-gray-300">
                  {t('vision.description2')}
                </p>
                <p className="mt-6 text-base leading-6 text-gray-600 dark:text-gray-300">
                  {t('vision.description3')}
                </p>
              </div>
              <div className="flex flex-wrap items-start justify-end gap-6 sm:gap-8 lg:contents">
                <div className="w-0 flex-auto lg:ml-auto lg:w-auto lg:flex-none lg:self-end">
                  <img
                    src="/hero11.png"
                    alt=""
                    className="aspect-[7/5] w-[37rem] max-w-none rounded-2xl bg-gray-50 object-cover"
                  />
                </div>
                <div className="contents lg:col-span-2 lg:col-end-2 lg:ml-auto lg:flex lg:w-[37rem] lg:items-start lg:justify-end lg:gap-x-8">
                  <div className="order-first flex w-64 flex-none justify-end self-end lg:w-auto">
                    <img
                      src="/hero5.png"
                      alt=""
                      className="aspect-[4/3] w-[24rem] max-w-none flex-none rounded-2xl bg-gray-50 object-cover"
                    />
                  </div>
                  <div className="flex w-96 flex-auto justify-end lg:w-auto lg:flex-none">
                    <img
                      src="/hero4-horizen.png"
                      alt=""
                      className="aspect-[7/5] w-[37rem] max-w-none flex-none rounded-2xl bg-gray-50 object-cover"
                    />
                  </div>
                  <div className="hidden sm:block sm:w-0 sm:flex-auto lg:w-auto lg:flex-none">
                    <img
                      src="/hero2.png"
                      alt=""
                      className="aspect-[4/3] w-[24rem] max-w-none rounded-2xl bg-gray-50 object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Open Source */}
        <div className="mx-auto mt-32 max-w-8xl px-6 sm:mt-40 lg:px-8 2xl:max-w-screen-2xl">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {t('openSource.title')}
            </h2>
            <p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-300">
              {t('openSource.description')}
            </p>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl flex-col gap-8 lg:mx-0 lg:mt-20 lg:max-w-none lg:flex-row lg:items-end">
            <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-gray-50 p-8 sm:w-3/4 sm:max-w-md sm:flex-row-reverse sm:items-end lg:w-72 lg:max-w-none lg:flex-none lg:flex-col lg:items-start">
              <p className="flex-none text-3xl font-bold tracking-tight text-gray-900">
                6.7k
              </p>
              <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
                <p className="text-lg font-semibold tracking-tight text-gray-900">
                  Users with our Projectse
                </p>
                <p className="mt-2 text-base leading-7 text-gray-600">
                  Researchers and developers from all over the world are using
                  DeepModeling to solve their problems.
                </p>
              </div>
            </div>
            <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-gray-900 p-8 sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-sm lg:flex-auto lg:flex-col lg:items-start lg:gap-y-44">
              <p className="flex-none text-3xl font-bold tracking-tight text-white">
                652k
              </p>
              <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
                <p className="text-lg font-semibold tracking-tight text-white">
                  Commits on Deepmodeling
                </p>
                <p className="mt-2 text-base leading-7 text-gray-400">
                  Researchers and developers from all over the world are using
                  DeepModeling to solve their problems.
                </p>
              </div>
            </div>
            <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-indigo-600 p-8 sm:w-11/12 sm:max-w-xl sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-none lg:flex-auto lg:flex-col lg:items-start lg:gap-y-28">
              <p className="flex-none text-3xl font-bold tracking-tight text-white">
                1.2k
              </p>
              <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
                <p className="text-lg font-semibold tracking-tight text-white">
                  Related Publications
                </p>
                <p className="mt-2 text-base leading-7 text-indigo-200">
                  Researchers and developers from all over the world are using
                  DeepModeling to solve their problems.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Join Us */}
        <div className="relative py-24 lg:pb-32">
          {/* Background */}
          <div
            className="absolute inset-x-0 top-4 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
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

          <div id="joinus" className="px-6 lg:px-8">
            <div className="mx-auto max-w-2xl pt-24 text-center sm:pt-40 lg:max-w-6xl">
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                {t('joinUs.title')}
              </h2>
              <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-300">
                {t('joinUs.subtitle')}
                <a
                  href="mailto:contact@deepmodeling.org"
                  className="text-indigo-600 dark:text-indigo-400"
                >
                  {' '}
                  {t('joinUs.email')}
                </a>
              </p>
            </div>
          </div>

          {/* Content section */}
          <div className="mx-auto mt-20 max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
              <div className="grid max-w-xl grid-cols-1 gap-8 text-base leading-7 text-neutral-600 dark:text-neutral-300 lg:max-w-none lg:grid-cols-2">
                <div>
                  <p>{t('joinUs.description1')}</p>
                  <p className="mt-8">{t('joinUs.description2')}</p>
                </div>
                <div>
                  <p>{t('joinUs.description3')}</p>
                  <p className="mt-8">{t('joinUs.description4')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Github Ad */}
        <div className="mx-auto max-w-8xl pb-32 pt-24 sm:px-6 lg:px-8 2xl:max-w-screen-2xl">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
              aria-hidden="true"
            >
              <circle
                cx={512}
                cy={512}
                r={512}
                fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
                fillOpacity="0.7"
              />
              <defs>
                <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                  <stop stopColor="#7775D6" />
                  <stop offset={1} stopColor="#E935C1" />
                </radialGradient>
              </defs>
            </svg>
            <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {t('GithubAd.title1')}
                <br />
                {t('GithubAd.title2')}
              </h2>
              <p className="mt-6 text-base leading-7 text-gray-300">
                {t('GithubAd.description1')}
              </p>
              <p className="mt-6 text-base leading-7 text-gray-300">
                {t('GithubAd.description2')}
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                <a
                  target="_blank"
                  href="https://github.com/deepmodeling"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {t('GithubAd.button.primary')}
                </a>
                <a
                  target="_blank"
                  href="#"
                  className="text-sm font-semibold leading-6 text-white"
                >
                  {t('GithubAd.button.secondary')}{' '}
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
            <div className="relative mt-16 h-80 lg:mt-16">
              <img
                className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
                src="/DeepModelingGithub.png"
                alt="App screenshot"
                width={1824}
                height={1080}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
