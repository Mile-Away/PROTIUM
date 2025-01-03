'use client';
import { NodeTemplateProps } from '@/@types/flociety';
import GridBackground from '@/components/GridBackground';
import { useCRUD } from '@/hooks/useCrud';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useEffect, useId, useRef, useState } from 'react';
import NodeTemplateCard from './NodeTemplateCard';

export default function Page() {
  const { fetchData, dataCRUD, error, isLoading } = useCRUD<NodeTemplateProps>(
    [],
    '/flociety/vs/nodes/library/',
  );
  const id = useId();
  const [nodeTemplates, setNodeTemplates] = useState<NodeTemplateProps[]>([]);
  const [cardSizes, setCardSizes] = useState<
    { id: string; width: number; height: number }[]
  >([]);
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [positions, setPositions] = useState<{ left: number; top: number }[]>(
    [],
  );

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (dataCRUD) {
      setNodeTemplates(dataCRUD);
    }
  }, [dataCRUD]);

  // Get card sizes
  useEffect(() => {
    const sizes = nodeTemplates.map((node) => {
      const card = cardRefs.current[node.name];
      if (card) {
        return {
          id: node.name,
          width: card.offsetWidth,
          height: card.offsetHeight,
        };
      }
      return { id: node.name, width: 0, height: 0 };
    });
    setCardSizes(sizes);
  }, [nodeTemplates]);

  // Get container width
  useEffect(() => {
    const updateContainerWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    // Initial update
    updateContainerWidth();

    // Add event listener for window resize
    window.addEventListener('resize', updateContainerWidth);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', updateContainerWidth);
    };
  }, []);

  // Calculate positions
  useEffect(() => {
    if (containerWidth === 0 || cardSizes.length === 0) return;

    const gap = 16;
    const columnCount = Math.floor(containerWidth / cardSizes[0].width);
    const columnHeights = Array(columnCount).fill(0);
    const columnWidths = Array(columnCount).fill(0);

    const newPositions = cardSizes.map((card, index) => {
      // 行内 columnIndex
      let columnIndex = index % columnCount;
      let rowIndex = Math.floor(index / columnCount);

      const left = columnWidths
        .slice(0, columnIndex)
        .reduce((acc, width) => acc + width, 0);
      const top = columnHeights[columnIndex];

      columnHeights[columnIndex] += card.height + gap;
      if (columnIndex === 0) {
        // 如果是新行，重置 columnWidths
        columnWidths.fill(0);
        columnWidths[columnIndex] += card.width + gap;
      } else {
        columnWidths[columnIndex] += card.width + gap;
      }

      return { left, top };
    });

    setPositions(newPositions);
  }, [containerWidth, cardSizes]);

  return (
    <>

      <div className="my-16 flex h-32 items-center justify-center border-b py-24 dark:border-white/10">
        <div className=" relative w-1/2">
          <input
            type="text"
            className="form-input w-full rounded-md border border-gray-300 p-2 dark:border-white/10 dark:bg-white/5 placeholder:dark:text-white/60"
            placeholder="Search node template"
          />
          <MagnifyingGlassIcon className="absolute inset-y-0 right-2 h-6 w-6 translate-y-1/3 text-gray-400" />
        </div>
      </div>
      <div ref={containerRef} className="relative px-8 py-8">
        <GridBackground />
        <div
          className="relative"
          style={{
            position: 'relative',
            height: Math.max(
              ...positions.map(
                (pos) => pos.top + cardSizes[positions.indexOf(pos)].height,
              ),
            ),
            // marginLeft: startPx,
          }}
        >
          {nodeTemplates.map((node, index) => (
            <div
              key={id+node.name}
              ref={(el) => {
                cardRefs.current[node.name] = el;
              }}
              className={clsx(
                'absolute h-fit max-w-64 cursor-pointer overflow-x-auto rounded-md',
              )}
              style={{
                left: positions[index]?.left,
                top: positions[index]?.top,
              }}
            >
              <NodeTemplateCard node={node} className="" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
