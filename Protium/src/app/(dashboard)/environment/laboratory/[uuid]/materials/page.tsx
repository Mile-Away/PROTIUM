'use client';
import MatHeader from './MatHeader';
import MatTabs from './MatTabs';

export default function Page() {
  return (
    <div className="relative px-8 py-6 ">
      <div className="absolute inset-[35%] pointer-events-none block rounded-full bg-white/15 blur-2xl"></div>

      <MatHeader />

      <MatTabs />
    </div>
  );
}
