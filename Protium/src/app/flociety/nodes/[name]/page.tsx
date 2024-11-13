'use client';
import { NodeTemplateProps } from '@/@types/flociety';
import { WorkflowNodeDataProps } from '@/@types/workflow';
import InputNode from '@/app/(dashboard)/workflow/nodes/InputNode';
import { useDictCRUD } from '@/hooks/useCrud';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import MonacoEditor from '@monaco-editor/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import NodeTemplateHeader from './NodeTemplateHeader';

export default function Page({ params }: { params: { name: string } }) {
  const { fetchData, dataCRUD, error, isLoading } =
    useDictCRUD<NodeTemplateProps>(
      {} as NodeTemplateProps,
      `/flociety/node/${params.name}/`,
    );
  const [nodeStru, setNodeStru] = useState<
    (WorkflowNodeDataProps & { type: string }) | null
  >(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (dataCRUD.data?.body) {
      setNodeStru({ type: dataCRUD.type, ...dataCRUD.data });
    }
  }, [dataCRUD]);

  useEffect(() => {
    setTabItems([
      // {
      //   id: "description",
      //   name: "README",
      // },
      {
        id: 'dataStru',
        name: 'UI.json',
        type: 'json',
        source: JSON.stringify(nodeStru, null, 2),
      },
      {
        id: 'executor',
        name: 'Python Executor',
        type: 'python',
        source: pyCode,
      },
    ]);
  }, [nodeStru]);

  const pyCode = `class AbacusInputExecutor(IOExecutor, ABC):

    async def execute(self, compile: WorkflowNodeCompile) -> NodeStatus:

        body_source = await self.get_body_source_from_compile(compile, "abacus_input")

        dir_path = await self.create_dir_path()

        file_path = os.path.join(dir_path, "INPUT")

        await self.write(file_path, body_source)

        compile.source = file_path

        await self.save_compile(compile)

        return "success"
`;
  const [tabItems, setTabItems] = useState<any[]>([]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <NodeTemplateHeader {...dataCRUD} />
      <div className="relative my-4">
        <div className="absolute bottom-0 left-0 h-0.5 w-full bg-white/5"></div>
      </div>
      <div className="mt-8 flex h-full gap-4">
        <div className="h-full w-2/3 lg:w-1/2">
          <TabGroup as="div" className="h-full">
            <TabList className="flex gap-4">
              {tabItems.map((item) => (
                <Tab
                  key={item.id}
                  className="w-1/2 rounded-lg px-3 py-1 text-sm/6 font-semibold text-white focus:outline-none data-[hover]:bg-white/5 data-[selected]:bg-white/10 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
                >
                  {item.name}
                </Tab>
              ))}
            </TabList>
            <TabPanels className=" mt-4 h-full">
              {tabItems.map((item) => (
                <TabPanel
                  key={item.id}
                  className={clsx(
                    'h-[80vh] rounded-lg bg-[rgb(31,31,31)] p-2 ',
                  )}
                >
                  <MonacoEditor
                    language={item.type}
                    value={item.source}
                    height={'100%'}
                    theme="vs-dark"
                    options={{
                      minimap: {
                        enabled: false,
                      },
                      automaticLayout: true,
                    }}
                  />
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>
        </div>

        <div className="relative flex w-1/3 min-w-fit items-center justify-center rounded px-4 dark:bg-black/10 lg:w-1/2">
          <div className="z-10 w-fit">
            {nodeStru?.type && (
              <InputNode
                key={dataCRUD.name}
                id=""
                type={nodeStru.type}
                selected={false}
                zIndex={0}
                isConnectable={false}
                xPos={0}
                yPos={0}
                dragging
                data={nodeStru}
              />
            )}
          </div>
          <div className=" absolute bottom-0 right-0 p-4">
            <span className=" text-sm font-semibold italic">
              Version: {dataCRUD.version}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
