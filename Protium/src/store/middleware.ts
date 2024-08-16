import createAxiosWithInterceptors from '@/helpers/jwtinterceptor';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchNodeTemplate = createAsyncThunk(
  'workflow/fetchNodeTemplate',
  async ({ template }: { template: string }) => {
    const jwtAxios = createAxiosWithInterceptors();

    const response = await jwtAxios.get(`/flociety/node/${template}`);

    return response.data;
  },
);
