import { Container } from '@/components/Container';
import { useTranslation } from 'react-i18next';

export function SimpleLayout({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children?: React.ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <Container className="mt-16 sm:mt-32">
      <header className="max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          {t(title)}
        </h1>
        <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          {t(intro)}
        </p>
      </header>
      {children && <div className="mt-16 sm:mt-20">{children}</div>}
    </Container>
  );
}
