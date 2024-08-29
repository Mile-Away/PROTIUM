import copyToClipboard from '@/lib/copyToClipboard';
import { formatTime } from '@/lib/formatDate';
import { DocumentDuplicateIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useState } from 'react';
import DeleteTokenModal from './DeleteTokenModal';
import { TokenListProps } from './page';
import formatToken from '@/lib/formatToken';
export default function BorderdTableLists({
  tokens,
  handleDeleteToken,
}: {
  tokens: TokenListProps[];
  handleDeleteToken: (id: number) => void;
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tokenId, setTokenId] = useState<number>(0);
  const onDeleteToken = (id: number) => {
    setIsDeleteModalOpen(true);
    setTokenId(id);
  };

  return (
    <>
      <div className="">
        <div className="-mx-4 ring-1 ring-gray-300 dark:ring-white/15 sm:mx-0 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-white/10">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white lg:table-cell"
                >
                  Token
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white lg:table-cell"
                >
                  Created
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white lg:table-cell"
                >
                  Last used
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Select</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token, tokenIdx) => (
                <tr key={token.id}>
                  <td
                    className={clsx(
                      tokenIdx === 0 ? '' : 'border-t border-transparent',
                      'relative py-4 pl-4 pr-3 text-sm sm:pl-6',
                    )}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {token.name}
                    </div>
                    <div className="mt-1 flex flex-col text-gray-500 sm:block lg:hidden">
                      <span>{token.token}</span>
                      <span className="hidden sm:inline">·</span>
                      <span>{}</span>
                    </div>
                    {tokenIdx !== 0 ? (
                      <div className="absolute -top-px left-6 right-0 h-px bg-gray-200 dark:bg-white/10" />
                    ) : null}
                  </td>
                  <td
                    className={clsx(
                      tokenIdx === 0
                        ? ''
                        : 'border-t border-gray-200 dark:border-white/10',
                      'hidden px-3 py-3.5 text-xs text-gray-500 dark:text-gray-400 lg:table-cell',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span>{formatToken(token.token)}</span>
                      <DocumentDuplicateIcon
                        onClick={() => copyToClipboard(token.token)}
                        className="h-4 w-4 text-gray-500 hover:cursor-pointer dark:text-gray-400 hover:dark:text-white"
                      />
                    </div>
                  </td>
                  <td
                    className={clsx(
                      tokenIdx === 0
                        ? ''
                        : 'border-t border-gray-200 dark:border-white/10',
                      'hidden px-3 py-3.5 text-xs text-gray-500 lg:table-cell',
                    )}
                  >
                    {formatTime(token.created)}
                  </td>
                  <td
                    className={clsx(
                      tokenIdx === 0
                        ? ''
                        : 'border-t border-gray-200 dark:border-white/10',
                      'hidden px-3 py-3.5 text-xs text-gray-500 lg:table-cell',
                    )}
                  >
                    {formatTime(token.last_used)}
                  </td>
                  <td
                    className={clsx(
                      tokenIdx === 0 ? '' : 'border-t border-transparent',
                      'relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6',
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => onDeleteToken(token.id)}
                      className="inline-flex items-center rounded-md bg-neutral-900/10 px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm disabled:cursor-not-allowed disabled:opacity-30  disabled:hover:bg-white dark:bg-white/5 dark:text-neutral-400 dark:hover:text-red-600 dark:hover:bg-white/10 transition-colors"
                    >
                      Delete<span className="sr-only">, {token.name}</span>
                    </button>
                    {tokenIdx !== 0 ? (
                      <div className="absolute -top-px left-0 right-6 h-px bg-gray-200 dark:bg-white/10" />
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <DeleteTokenModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        handleDeleteToken={() => handleDeleteToken(tokenId)}
      />
    </>
  );
}
