import Markdown from '@/components/docs/Markdwon';
import '@/styles/markdown.abstract.css';
import Link from 'next/link';
import { Icon } from './icons/Icon';

export function QuickLinks({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose my-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
      {children}
    </div>
  );
}

export function QuickLink({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentProps<typeof Icon>['icon'];
}) {
  return (
    <div className="group relative mt-4 w-64 flex-shrink-0 rounded-xl border border-slate-200 dark:border-slate-800 xl:w-full">
      <div className="absolute -inset-px rounded-xl border-2 border-transparent opacity-0 [background:linear-gradient(var(--quick-links-hover-bg,theme(colors.sky.50)),var(--quick-links-hover-bg,theme(colors.sky.50)))_padding-box,linear-gradient(to_top,theme(colors.indigo.400),theme(colors.cyan.400),theme(colors.sky.500))_border-box] group-hover:opacity-100 dark:[--quick-links-hover-bg:theme(colors.slate.800)]" />
      <div className="relative overflow-hidden rounded-xl p-6">
        <Icon icon={icon} className="h-8 w-8" />
        <h2 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
          <Link href={href}>
            <span className="absolute -inset-px rounded-xl" />
            {title}
          </Link>
        </h2>
        <div className="mt-1 line-clamp-3 text-sm text-slate-700 dark:text-slate-400">
          <Markdown content={description} />
        </div>
      </div>
    </div>
  );
}
