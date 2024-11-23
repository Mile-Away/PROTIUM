'use client';

export default function Page() {
  return (
    <div className="relative h-64 w-64">
      <div className="before:animate-border-rotate absolute inset-0 h-full w-full before:absolute before:inset-[-2px] before:border-2 before:border-transparent before:border-t-green-500">
        <div className="flex h-full w-full items-center justify-center bg-neutral-800">
          <span className="text-2xl text-white">div</span>
        </div>
      </div>
    </div>
  );
}
