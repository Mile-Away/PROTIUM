import AbacusInputReact from './AbacusInputReact';

export const interactiveMapping: {
  [key: string]: React.FC<any>;
} = {
  abacus_input: AbacusInputReact,
  orbitals: AbacusInputReact,
};
