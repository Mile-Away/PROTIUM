import { NodeTemplateProps } from '@/@types/flociety';
import { TreeItemProps } from '@/app/(dashboard)/environment/laboratory/[uuid]/materials/[...dirs]/TreeSortable/types';
import createAxiosWithInterceptors from '@/helpers/jwtinterceptor';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchNodeTemplate = createAsyncThunk<
  NodeTemplateProps,
  { template: string; id?: string }
>(
  'workflow/fetchNodeTemplate',
  async ({ template, id }: { template: string; id?: string }) => {
    const jwtAxios = createAxiosWithInterceptors();

    const response = await jwtAxios.get(`/flociety/node/${template}`);

    if (!response.data) {
      throw new Error('No data returned');
    }

    const data = response.data as NodeTemplateProps;

    // console.log('fetchNodeTemplate', data);

    if (id) {
      return { ...data, id };
    }
    return data;
  },
);

export const fetchMaterials = createAsyncThunk<
  TreeItemProps[],
  { uuid: string }
>('material/fetchMaterials', async ({ uuid }: { uuid: string }) => {
  // const jwtAxios = createAxiosWithInterceptors();

  // const response = await jwtAxios.get('/materials/');

  // if (!response.data) {
  //   throw new Error('No data returned');
  // }

  // const data = response.data as TreeItemProps[];
  const data: TreeItemProps[] = [
    {
      id: 'Repository 1',
      type: 'Repository',
      children: [
        {
          id: 'Plate 2B',
          type: 'Plate',
          children: [],
          position: { x: 1, y: 1 },
          status: 'active',
        },
        {
          id: 'Container 4D',
          type: 'Container',
          position: { x: 2, y: 1 },
          children: [],
          status: 'idle',
        },
      ],
      status: 'active',
    },
    {
      id: 'Repository 3',
      type: 'Repository',
      children: [
        {
          id: 'Plate 3C',
          type: 'Plate',
          children: [],
          position: { x: 2, y: 3 },
          status: 'active',
        },
        { id: 'Container 5E', type: 'Container',
          position: { x: 1, y: 1 },
          children: [], status: 'idle' },
      ],
      status: 'active',
    },
    {
      id: 'Repository 2',
      type: 'Repository',
      children: [],
      status: 'active',
    },
    {
      id: 'Plate 1A',
      type: 'Plate',
      children: [
        { id: 'NMP 400ml', children: [], type: 'Container', status: 'active' },
        { id: 'THF', children: [], type: 'Container', status: 'active' },
      ],
      position: { x: 0, y: 0 },
      status: 'active',
    },
  ];

  return data;
});
