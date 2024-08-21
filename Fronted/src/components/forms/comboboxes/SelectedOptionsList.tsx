import { ArticleProps } from '@/@types/article';
import { MEDIA_URL } from '@/config';
import { formatTime } from '@/lib/formatDate';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';


export default function SelectedOptionsList({
  id,
  ...option
}: { id: number } & ArticleProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="flex items-center justify-between rounded-r border-l border-white bg-white/2.5 p-2 px-3"
    >
      <div className=" text-sm">
        <h1 className="mb-4 font-semibold">{option.title}</h1>
        <div className="flex items-center">
          <button className="-m-2 flex items-center gap-x-2  rounded-lg px-2 py-2 text-xs font-semibold text-zinc-600  dark:text-zinc-300 ">
            <img
              className="h-5 w-5 rounded-full"
              src={`${MEDIA_URL}${option.avatar}`}
              alt={option.author}
            />
            {option.author}
          </button>
          <span className=" ml-4 text-xs">{formatTime(option.updated_at)}</span>
        </div>
      </div>
      <div className=" cursor-move hover:text-white">
        <EllipsisVerticalIcon className="h-6 w-6" />
      </div>
    </div>
  );
}
