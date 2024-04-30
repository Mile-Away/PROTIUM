const PotcarOperator = ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="mt-8 flex flex-col space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <input
            className="h-8 w-full rounded-r border-l-2 bg-transparent pl-2 placeholder:text-xs focus:outline-none dark:border-indigo-600"
            type="text"
            placeholder="POSCAR..."
          />
        </div>
        <div className="w-full text-end">{children}</div>
      </div>
    );
  };
  
  export default PotcarOperator;