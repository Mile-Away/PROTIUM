'use client';
import { NodeTemplateProps } from '@/@types/flociety';
import { WorkflowNodeDataProps } from '@/@types/workflow';
import InputNode from '@/app/(workflow)/nodes/InputNode';
import GridBackground from '@/components/GridBackground';
import { useDictCRUD } from '@/hooks/useCrud';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import MonacoEditor from '@monaco-editor/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';



export default function Page({ params }: { params: { name: string } }) {
  const { fetchData, dataCRUD, error, isLoading } =
    useDictCRUD<NodeTemplateProps>(
      {} as NodeTemplateProps,
      `/flociety/node/${params.name}/`,
    );
  const [nodeStru, setNodeStru] = useState<
    (WorkflowNodeDataProps & { type: string }) | null
  >(null);

  const [ndoeBodySchema, setNodeBodySchema] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (dataCRUD.data?.body) {
      setNodeStru({ type: dataCRUD.type, ...dataCRUD.data });
      setNodeBodySchema(dataCRUD.data.body.map((item) => item.schema));
    }
  }, [dataCRUD]);

  useEffect(() => {
    setTabItems([
      {
        id: 'dataStru',
        name: 'UI.json',
        type: 'json',
        source: JSON.stringify(nodeStru, null, 2),
      },
      { id: 'executor', name: 'Python Executor', type: 'python', source: pyCode },
    ]);
  }, [nodeStru, ndoeBodySchema]);

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
      <div className=" flex h-screen w-screen gap-4 px-8 pt-24">
        <div className="flex-1">
          <TabGroup as="div" className="h-full">
            <TabList className="flex gap-4">
              {tabItems.map((item) => (
                <Tab
                  key={item.id}
                  className="rounded-lg w-1/2 px-3 py-1 text-sm/6 font-semibold text-white focus:outline-none data-[hover]:bg-white/5 data-[selected]:bg-white/10 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
                >
                  {item.name}
                </Tab>
              ))}
            </TabList>
            <TabPanels className=" mt-4 h-[90%]">
              {tabItems.map((item) => (
                <TabPanel key={item.id} className={clsx('h-full p-2 rounded-lg bg-[rgb(31,31,31)]')}>
                  <MonacoEditor
                    language={item.type}
                    value={item.source}
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

        <div className="relative my-8 mt-12 flex w-1/2 min-w-fit items-center justify-center rounded px-4 dark:bg-black/10">
          <div className="w-fit z-10">
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
