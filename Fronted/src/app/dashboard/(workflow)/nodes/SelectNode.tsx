import { BasicNodeProps } from '@/@types/workflow';
import StackedCards from '@/components/forms/radio-groups/stacked_cards';
import BasicNode from './BasicNode';
export default function SelectNode(props: BasicNodeProps) {
  const { id, type, dragging, data } = props;

  const plans = [
    {
      name: 'GGA（Generalized Gradient Approximation）',
      ram: '8GB',
      cpus: '4 CPUs',
      disk: '160 GB SSD disk',
      price: '$40',
    },
    {
      name: 'LDA（Local Density Approximation）',
      ram: '12GB',
      cpus: '6 CPUs',
      disk: '256 GB SSD disk',
      price: '$80',
    },
    {
      name: 'PAW（Projector Augmented Wave）',
      ram: '16GB',
      cpus: '8 CPUs',
      disk: '512 GB SSD disk',
      price: '$160',
    },
    // {
    //   name: 'HSE（Heyd-Scuseria-Ernzerhof）',
    //   ram: '32GB',
    //   cpus: '12 CPUs',
    //   disk: '1024 GB SSD disk',
    //   price: '$240',
    // },
  ];
  return (
    <BasicNode {...props}>
      <StackedCards items={plans} />
    </BasicNode>
  );
}
