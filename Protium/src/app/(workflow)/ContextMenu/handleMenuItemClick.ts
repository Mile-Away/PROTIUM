import { addNode } from '@/store/workflow/workflowSlice';
import { Dispatch } from '@reduxjs/toolkit';
import { NodeMapping } from '../nodes/nodeTypes';
const handleMenuItemClick = (action: string) => {
  return (dispatch: Dispatch) => {
    switch (action) {
      // Node 相关操作
      case 'hidden':
        return;
      case 'delete':
        return;
      case 'duplicate':
        return;

      // Basic 相关操作
      case 'poscar':
        return dispatch(addNode(NodeMapping.POSCAR));

      case 'potcar':
        return dispatch(addNode(NodeMapping.POTCAR));

      case 'incar':
        return dispatch(addNode(NodeMapping.INCAR));

      case 'kpoints':
        return dispatch(addNode(NodeMapping.KPOINTS));

      // Solver 相关操作 
      case 'vasp':
        return dispatch(addNode(NodeMapping.VASP));

      case 'abacus':
        return dispatch(addNode(NodeMapping.ABACUS));

      // Outputs 相关操作
      case 'vasp_outputs':
        return dispatch(addNode(NodeMapping.VASP_OUTPUTS));
      
      case 'abacus_outputs':
        return dispatch(addNode(NodeMapping.ABACUS_OUTPUTS));

      // Pipeline 相关操作
      case 'pipeline_abacus_siab':
        return dispatch(addNode(NodeMapping.PIPELINE_ABACUS_SIAB));
      default:
        return;
    }
  };
};

export default handleMenuItemClick;
