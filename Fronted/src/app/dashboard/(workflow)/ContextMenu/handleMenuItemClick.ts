import { addNode } from '@/store/workflow/workflowSlice';
import { Dispatch } from '@reduxjs/toolkit';

const handleMenuItemClick = (action: string) => {
  return (dispatch: Dispatch) => {
    switch (action) {
      case 'poscar':
        return dispatch(
          addNode({
            type: 'structureInput',
            data: {
              header: 'POSCAR',
              body: [{ id: '', source: '', type: 'textarea', key: 'poscar' }],
              footer: 'VASP/POSCAR',
              handles: [{ type: 'source', key: 'poscar' }],
            },
            dragHandle: '.drag-handle',
          }),
        );

      case 'potcar':
        return dispatch(
          addNode({
            type: 'fileSelect',
            data: {
              header: 'POTCAR',
              body: [{ id: '', source: '', type: 'select', key: 'potcar' }],
              footer: 'VASP/POTCAR',
              handles: [{ type: 'source', key: 'potcar' }],
            },
            dragHandle: '.drag-handle',
          }),
        );

      case 'incar':
        return dispatch(
          addNode({
            type: 'structureInput',
            data: {
              header: 'INCAR',
              body: [{ id: '', source: '', type: 'textarea', key: 'incar' }],
              footer: 'VASP/INCAR',
              handles: [{ type: 'source', key: 'incar' }],
            },
            dragHandle: '.drag-handle',
          }),
        );

      case 'kpoints':
        return dispatch(
          addNode({
            type: 'structureInput',
            data: {
              header: 'KPOINTS',
              handles: [
                {
                  key: 'kpoints',
                  type: 'source',
                },
              ],
              body: [{ id: '', source: '', type: 'textarea', key: 'kpoints' }],
              footer: 'VASP/KPOINTS',
            },
            dragHandle: '.drag-handle',
          }),
        );
      case 'vasp':
        return dispatch(
          addNode({
            type: 'solver',
            data: {
              body: [{ id: '', source: '', type: 'textarea', key: 'vasp' }],
              header: 'VASP',
              footer: 'VASP 5.4.4',
              handles: [
                { key: 'poscar', type: 'target' },
                { key: 'potcar', type: 'target' },
                { key: 'incar', type: 'target' },
                { key: 'kpoints', type: 'target' },
                { key: 'structure', type: 'source' },
              ],
            },
            dragHandle: '.drag-handle',
          }),
        );

      default:
        return;
    }
  };
};

export default handleMenuItemClick;
