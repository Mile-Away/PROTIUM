

import { configureStore } from '@reduxjs/toolkit';

export interface RootReducerProps {
  // workflow: WorkflowStateProps;
}

const store = configureStore({
  reducer: {
    // workflow: workflowReducer,
  },
});

export default store;
