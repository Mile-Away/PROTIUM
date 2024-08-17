import Link from 'next/link';

export default function FlocietyButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="  h-auto w-auto">
        <Link
          href={href}
          passHref
          target="_blank"
          rel="flociety"
          className="group relative z-[1] flex items-center justify-center rounded bg-gradient-to-br from-violet-600 to-fuchsia-600 bg-clip-text px-3 py-1.5 text-transparent outline-none hover:text-white dark:from-violet-400 dark:to-fuchsia-400"
        >
          {children}
          <div
            className="animate-gradient-flow absolute inset-0 z-[-1] rounded opacity-0 group-hover:opacity-100"
            style={{
              backgroundSize: '400% 400%',
              backgroundImage:
                'linear-gradient(90deg, #8B5CF6, #EC4899, #F59E0B)',
              animation: 'gradient-flow 8s linear infinite',
            }}
          ></div>
        </Link>
      </div>
      <style jsx>{`
        @keyframes gradient-flow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </>
  );
}
