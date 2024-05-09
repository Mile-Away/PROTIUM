export default function Page() {
  return (
    <div className="relative w-64 h-64">
      <div className="absolute inset-0 w-full h-full before:absolute before:inset-[-2px] before:border-2 before:border-transparent before:animate-border-rotate before:border-t-green-500">
        <div className="flex items-center justify-center w-full h-full bg-gray-800">
          <span className="text-white text-2xl">div</span>
        </div>
      </div>
    </div>
  );
}
