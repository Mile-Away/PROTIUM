import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Background */}
      <div
        className="absolute bottom-0 left-1/3 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
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
      <div className="my-16  flex h-32 items-center justify-center border-b py-24 dark:border-white/10">
        <div className=" relative w-1/2">
          <input
            type="text"
            className="form-input w-full rounded-md border border-gray-300 p-2 dark:border-white/10 dark:bg-white/5 placeholder:dark:text-white/60"
            placeholder="Search node template"
          />
          <MagnifyingGlassIcon className="absolute inset-y-0 right-2 h-6 w-6 translate-y-1/3 text-gray-400" />
        </div>
      </div>
      {children}
    </>
  );
}
