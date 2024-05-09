/* eslint-disable @next/next/no-img-element */
import Logo from '@/@brand/Logo';
import Loading from '@/app/loading';
import { BookIcon, FeedIcon } from '@/components/Icons';
import { GitHubIcon } from '@/components/SocialIcons';
import { IconLink } from '@/components/login/IconLink';
import { SignUpForm } from '@/components/login/SignUpForm';
import { DocumentSite } from '@/config';
import { useAuthServiceContext } from '@/context/AuthContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import BRAND from '@/@brand/brand';
import LoggedForm from './LoggedForm';

const ButtonGroup = () => {
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-x-1 gap-y-3 sm:gap-x-2 lg:justify-start">
      <IconLink
        href="https://github.com/deepmodeling"
        icon={GitHubIcon}
        title="Login with Github"
        className="flex-none"
      >
        GitHub
      </IconLink>
      <IconLink
        href={`${DocumentSite}`}
        icon={BookIcon}
        title="Read Documentation"
        className="flex-none"
      >
        Documentation
      </IconLink>
      <IconLink
        href="#"
        title="Give Feedback"
        icon={FeedIcon}
        className="flex-none"
        onClick={() => alert('Feedback is not available yet')}
      >
        Feedback
      </IconLink>
    </div>
  );
};

export function Intro() {
  const { t } = useTranslation('login');
  const { isLogged, checkIsLogged } = useAuthServiceContext();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    checkIsLogged().then(() => {
      setIsDataLoaded(true);
    });
  }, []);

  if (!isDataLoaded) {
    return <Loading />;
  } else {
    return (
      <>
        <div className="inline-block">
          <Link
            className="flex h-8 items-center transition-opacity duration-150 ease-in-out hover:opacity-75"
            href="/"
            title="Back Home"
          >
            {/* <LogoBanner className="h-10 w-auto fill-indigo-800 dark:fill-indigo-500" /> */}
            <Logo className="h-10 fill-indigo-800 dark:fill-white" />
            <span className="ms-2 flex text-3xl font-bold leading-8 text-indigo-800 dark:text-gray-100">
              {BRAND}
            </span>
          </Link>
        </div>
        {!isLogged ? (
          <h1 className="mt-14 font-display text-3xl/tight font-light dark:text-white">
            {t('intro.title1')}
            <span className="text-indigo-600 dark:text-indigo-300">
              {t('intro.title2')}
            </span>
          </h1>
        ) : (
          <h1 className="mt-14 font-display text-4xl/tight font-light dark:text-white">
            {t('logined.title1')}
            <span className="text-indigo-600 dark:text-indigo-300">
              {t('logined.title2')}
            </span>
          </h1>
        )}
        <p className="mt-4 text-sm/6 dark:text-gray-300">
          {t('intro.description')}
        </p>

        {isLogged ? <LoggedForm /> : <SignUpForm />}

        <ButtonGroup />
      </>
    );
  }
}

export function IntroFooter() {
  return (
    <p className="mt-8 text-xs leading-5 text-gray-500 md:order-1 md:mt-0">
      &copy; {new Date().getFullYear()} DeepModeling. All rights reserved.
    </p>
    // <p className="flex items-baseline gap-x-2 text-[0.8125rem]/6 text-gray-500">
    //   Brought to you by{' '}
    //   <IconLink href="#" icon={GitHubIcon} compact large>
    //     MileAway
    //   </IconLink>
    // </p>
  );
}
