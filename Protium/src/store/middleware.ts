import { NodeTemplateProps } from '@/@types/flociety';
import createAxiosWithInterceptors from '@/helpers/jwtinterceptor';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchNodeTemplate = createAsyncThunk<
  NodeTemplateProps,
  { template: string }
>('workflow/fetchNodeTemplate', async ({ template }: { template: string }) => {
  const jwtAxios = createAxiosWithInterceptors();

  const response = await jwtAxios.get(`/flociety/node/${template}`);

  return response.data as NodeTemplateProps;
});
