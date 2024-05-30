import { useState } from 'react';

export default function StackedCards({ items }: { items: any[] }) {
  const [selected, setSelected] = useState(items[0]);

  return (
    <div className="mt-8">
      <form>
        <label className="sr-only">Server size</label>
        <div className="space-y-4">
          {items.map((item) => (
            <option key={item.name} value={item}>
              <>
                <span className="flex flex-col text-xs">
                  <label className="  text-gray-900 dark:text-white">
                    {item.name}
                  </label>
                </span>
              </>
            </option>
          ))}
        </div>
      </form>
    </div>
  );
}
