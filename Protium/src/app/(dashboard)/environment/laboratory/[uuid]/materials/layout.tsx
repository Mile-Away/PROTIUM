import SortableTree from '@/components/sortableTree/SortableTree';
import ListHeader from './ListHeader';

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { uuid: string };
}) {
  return (
    <div className=" my-4 flex h-[calc(100%-12rem)] w-full rounded">
      <div className=" w-64 rounded-l bg-white/5 px-2 py-4">
        <ListHeader />
        <SortableTree collapsible indicator />
      </div>
      <div className=" relative h-full flex-1 overflow-scroll rounded-r bg-black">
        {children}
      </div>
    </div>
  );
}
