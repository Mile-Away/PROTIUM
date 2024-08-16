import { addNode } from '@/store/workflow/workflowSlice';
import { Dispatch } from '@reduxjs/toolkit';
import { NodeMapping } from '../nodes/nodeTypes';
import { fetchNodeTemplate } from '@/store/middleware';
const handleMenuItemClick = (action: string) => {
  return (dispatch: Dispatch<any>) => {
    switch (action) {
      // Node 相关操作
      case 'hidden':
        return;
      case 'delete':
        return;
      case 'duplicate':
        return;

      // Basic 相关操作
      case 'abacus_input':
        return dispatch(fetchNodeTemplate({template: 'ABACUS_INPUT'}));

      default:
        return;
    }
  };
};

export default handleMenuItemClick;
