import { rectSortingStrategy } from '@dnd-kit/sortable';
import { GridSortable } from '../GridSortable/GridSortable';

export default function LayoutTab({
  gridContainerColumns = 5,
}: {
  gridContainerColumns: number;
}) {
  return (
    <GridSortable
      gridContainerColumns={gridContainerColumns}
      adjustScale
      // Container={(props: any) => (
      //   <GridContainer {...props} columns={gridContainerColumns} />
      // )}
      strategy={rectSortingStrategy}
      wrapperStyle={() => ({
        width: 140,
        height: 140,
      })}
      activationConstraint={{
        // delay: 250,
        distance: 1,
        // tolerance: 5,
      }}
    />
  );
}
