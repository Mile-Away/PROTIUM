'use client';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import { UserProps } from '@/@types/auth-service';
import { Container } from '@/components/Container';
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
} from '@/components/SocialIcons';
import { MEDIA_URL } from '@/config';
import { useDictCRUD } from '@/hooks/useCrud';
import image1 from '@/images/photos/image-1.jpg';
import image2 from '@/images/photos/image-2.jpg';
import image3 from '@/images/photos/image-3.jpg';
import image4 from '@/images/photos/image-4.jpg';
import image5 from '@/images/photos/image-5.jpg';
import { useEffect } from 'react';
import Article from '../../Article';
import Achievements from './Achievements';
import ActivityHistory from './ActivityHistory';

function SocialLink({
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link> & {
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link className="group -m-1 p-1" {...props}>
      <Icon className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300" />
    </Link>
  );
}

function Photos() {
  let rotations = [
    'rotate-2',
    '-rotate-2',
    'rotate-2',
    'rotate-2',
    '-rotate-2',
  ];

  return (
    <div className="mt-16 sm:mt-20">
      <div className="-my-4 flex justify-center gap-5 overflow-hidden py-4 sm:gap-8">
        {[image1, image2, image3, image4, image5].map((image, imageIndex) => (
          <div
            key={image.src}
            className={clsx(
              'relative aspect-[9/10] w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 sm:w-72 sm:rounded-2xl',
              rotations[imageIndex % rotations.length],
            )}
          >
            <Image
              src={image}
              alt=""
              sizes="(min-width: 640px) 18rem, 11rem"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const username = params.username;

  const { fetchData, dataCRUD, isLoading, error } = useDictCRUD(
    {} as UserProps,
    `/accounts/get_public_info/?username=${username}`,
  );

  useEffect(() => {
    if (username) {
      fetchData();
    }
  }, [username]);

  return (
    <>
      <Container className="mt-24">
        <div className="max-w-2xl">
          <div className="flex flex-col items-start gap-8">
            <img
              src={MEDIA_URL + dataCRUD.avatar}
              alt=""
              className="h-24 w-24 rounded-full"
            />
            <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
              {dataCRUD.username}
            </h1>
          </div>
          <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
            {dataCRUD.about ? dataCRUD.about : 'No about information yet.'}
          </p>

          <div className="mt-6 flex gap-6">
            <SocialLink
              href="https://twitter.com"
              aria-label="Follow on Twitter"
              icon={TwitterIcon}
            />
            <SocialLink
              href="https://instagram.com"
              aria-label="Follow on Instagram"
              icon={InstagramIcon}
            />
            <SocialLink
              href="https://github.com"
              aria-label="Follow on GitHub"
              icon={GitHubIcon}
            />
            <SocialLink
              href="https://linkedin.com"
              aria-label="Follow on LinkedIn"
              icon={LinkedInIcon}
            />
          </div>
        </div>
      </Container>
      {/* <Photos /> */}
      <Container className="mt-24 md:mt-28">
        <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
          <div className="flex flex-col gap-16">
            {dataCRUD.public_articles && dataCRUD.public_articles.length > 0 ? (
              dataCRUD.public_articles.map((article) => (
                <Article
                  key={article.uuid}
                  article={article}
                  className="pt-4 md:grid md:grid-cols-4 md:items-baseline"
                />
              ))
            ) : (
              <p> None Published Article yet.</p>
            )}
          </div>
          <div className="space-y-10 lg:pl-16 xl:pl-24">
            <Achievements />
            <ActivityHistory />
          </div>
        </div>
      </Container>
    </>
  );
}
