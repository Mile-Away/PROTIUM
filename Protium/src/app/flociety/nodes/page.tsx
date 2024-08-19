'use client';
import { NodeTemplateProps } from '@/@types/flociety';
import nodeTypes from '@/app/(workflow)/nodes/nodeTypes';
import GridBackground from '@/components/GridBackground';
import { useCRUD } from '@/hooks/useCrud';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
  const { fetchData, dataCRUD, error, isLoading } = useCRUD<NodeTemplateProps>(
    [],
    '/flociety/vs/nodes/library/',
  );
  const router = useRouter();
  const [nodeTemplates, setNodeTemplates] = useState<NodeTemplateProps[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (dataCRUD) {
      setNodeTemplates(dataCRUD);
    }
  }, [dataCRUD]);

  return (
    <>

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
      <div className=" relative flex flex-wrap px-8 py-8">
        <GridBackground />
        {nodeTemplates.map((node) => {
          const NodeTypeComponent = nodeTypes[node.type];
          return (
            <div
              key={node.name}
              className="relative h-fit cursor-pointer rounded-md  p-2 
              "
              onClick={() => router.push(`/flociety/nodes/${node.name}`)}
            >
              <div
                className=" relative h-fit w-fit after:transition-colors after:duration-300 after:ease-in-out
              hover:after:absolute hover:after:inset-0 hover:after:bg-white hover:after:opacity-5 hover:after:content-[''] "
              >
                <div className=" pointer-events-none -z-[9999]">
                  <NodeTypeComponent
                    id=""
                    type={node.type}
                    selected={false}
                    zIndex={0}
                    isConnectable={false}
                    xPos={0}
                    yPos={0}
                    dragging
                    data={node.data}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
