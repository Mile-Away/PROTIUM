
import SpacePage from '../SpacePage/Space';



export default function Page({ params }: { params: { name: string } }) {
  const { name } = params;

  return <SpacePage name={name} />;
}
