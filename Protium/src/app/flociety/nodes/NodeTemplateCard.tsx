import { NodeTemplateProps } from '@/@types/flociety';
import nodeTypes from '@/app/(dashboard)/workflow/nodes/nodeTypes';
import { useRouter } from 'next/navigation';

export default function NodeTemplateCard({
  node,
  ...props
}: {
  node: NodeTemplateProps;
} & React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();
  const NodeTypeComponent = nodeTypes[node.type];
  return (
    <div onClick={() => router.push(`/flociety/nodes/${node.name}`)} {...props}>
      <div
        className="relative h-fit w-fit after:transition-colors after:duration-300 after:ease-in-out
      hover:after:absolute hover:after:inset-0 hover:after:bg-neutral-400 hover:after:opacity-5 hover:after:content-[''] dark:hover:after:bg-white "
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
}
