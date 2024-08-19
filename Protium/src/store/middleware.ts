import { NodeTemplateProps } from '@/@types/flociety';
import createAxiosWithInterceptors from '@/helpers/jwtinterceptor';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchNodeTemplate = createAsyncThunk<
  NodeTemplateProps,
  { template: string, id?: string }
>('workflow/fetchNodeTemplate', async ({ template, id }:{ template: string, id?: string }) => {
  const jwtAxios = createAxiosWithInterceptors();

  const response = await jwtAxios.get(`/flociety/node/${template}`);

  if (!response.data) {
    throw new Error('No data returned');
  }

  const data = response.data as NodeTemplateProps;

  console.log('fetchNodeTemplate', data);

  if (id) {
    return { ...data, id };
  }
  return data;
});
