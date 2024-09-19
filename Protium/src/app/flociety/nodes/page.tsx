'use client';
import { NodeTemplateProps } from '@/@types/flociety';
import GridBackground from '@/components/GridBackground';
import { useCRUD } from '@/hooks/useCrud';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import NodeTemplateCard from './NodeTemplateCard';

export default function Page() {
  const { fetchData, dataCRUD, error, isLoading } = useCRUD<NodeTemplateProps>(
    [],
    '/flociety/vs/nodes/library/',
  );

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
  const [startPx, setStartPx] = useState(0);

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
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, [containerRef.current]);

  // Calculate positions
  useEffect(() => {
    if (containerWidth === 0 || cardSizes.length === 0) return;

    const gap = 16;

    const columnCount = Math.floor(containerWidth / cardSizes[0].width);

    console.log(columnCount); // 5

    const fullWidth =
      columnCount * cardSizes[0].width + (columnCount - 1) * gap;

    setStartPx((containerWidth - fullWidth) / 2);

    const columnHeights = Array(columnCount).fill(0);

    console.log(columnHeights); // [0, 0, 0, 0, 0]

    const columnWidths = Array(columnCount).fill(0);

    console.log(columnWidths); // [0, 0, 0, 0, 0]

    const newPositions = cardSizes.map((card, index) => {
      console.log(card); // { id: 'start', width: 200, height: 200 }

      // 行内 columnIndex
      let columnIndex = index % columnCount;
      let rowIndex = Math.floor(index / columnCount);

      console.log('columnIndex', rowIndex, columnIndex); // 0

      const left = columnWidths
        .slice(0, columnIndex)
        .reduce((acc, width) => acc + width, 0);

      const top = columnHeights[columnIndex];

      columnHeights[columnIndex] += card.height + gap;

      console.log('columnHeights', columnHeights); // [200, 0, 0, 0, 0]

      // 如果是新行，重置 columnWidths
      if (columnIndex === 0) {
        columnWidths.fill(0);
        columnWidths[columnIndex] += card.width + gap;
      } else {
        columnWidths[columnIndex] += card.width + gap;
      }

      console.log('columnWidths', columnWidths); // [200, 0, 0, 0, 0]

      return { left, top };
    });

    setPositions(newPositions);
  }, [containerWidth, cardSizes]);

  return (
    <div ref={containerRef} className="relative py-8">
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
          marginLeft: startPx,
        }}
      >
        {nodeTemplates.map((node, index) => (
          <div
            key={node.name}
            ref={(el) => {
              cardRefs.current[node.name] = el;
            }}
            className={clsx(
              'absolute h-fit max-w-64 cursor-pointer overflow-x-auto rounded-md',
            )}
            style={{ left: positions[index]?.left, top: positions[index]?.top }}
          >
            <NodeTemplateCard node={node} className="" />
          </div>
        ))}
      </div>
    </div>
  );
}
