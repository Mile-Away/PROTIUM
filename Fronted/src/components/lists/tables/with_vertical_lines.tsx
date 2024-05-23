import { ReleaseProps } from '@/@types/github';
import { formatTime } from '@/lib/formatDate';

export default function ListsTablesWithVerticalLines({
  items,
  handleClick,
}: {
  items: ReleaseProps[];
  handleClick: () => void;
}) {
  return (
    <div className="">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Preview
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-neutral-300">
            A list preview of your release history.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={handleClick}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Fetch Again
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-neutral-600">
              <thead>
                <tr className="divide-x divide-gray-200 dark:divide-neutral-700">
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-0"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    Author
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    Created At
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pr-0"
                  >
                    Published At
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pr-0"
                  >
                    Assets Number
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {items.map((item, idx) => (
                  <tr
                    key={item.name}
                    className="divide-x divide-gray-200 dark:divide-neutral-700"
                  >
                    <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 dark:text-white sm:pl-0">
                      <a
                        href={item.html_url}
                        target="_blank"
                        className=" dark:hover:text-white"
                      >
                        {item.tag_name}
                      </a>
                    </td>
                    <td className="flex gap-2 whitespace-nowrap p-4 text-sm text-gray-500 dark:text-neutral-300">
                      <img
                        src={item.author.avatar_url}
                        alt=""
                        className="h-6 w-6 rounded-full"
                      />
                      <a
                        href={item.author.html_url}
                        target="_blank"
                        className=" dark:hover:text-white"
                      >
                        {item.author.login}
                      </a>
                    </td>
                    <td className="whitespace-nowrap p-4 text-sm text-gray-500 dark:text-neutral-300">
                      {formatTime(item.created_at)}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 dark:text-neutral-300 sm:pr-0">
                      {formatTime(item.published_at)}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 dark:text-neutral-300 sm:pr-0">
                      {item.assets.length + 2}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
