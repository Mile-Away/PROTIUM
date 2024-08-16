import workflowReducer from '@/store/workflow/workflowSlice';

import { WorkflowStateProps } from '@/@types/workflow';
import { configureStore } from '@reduxjs/toolkit';
export interface RootReducerProps {
  workflow: WorkflowStateProps;
}

const store = configureStore({
  reducer: {
    workflow: workflowReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
