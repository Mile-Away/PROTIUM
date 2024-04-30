import { SpaceProps } from '@/@types/space';
import { BASE_URL } from '@/config';
import SpacePage from './SpacePage/Space';

export async function generateStaticParams() {
  const posts = await fetch(BASE_URL + '/server/vs/select/').then((res) =>
    res.json(),
  );

  return posts.map((post: SpaceProps) => ({
    uuid: post.uuid,
  }));
}

export default function Page({ params }: { params: { uuid: string } }) {
  const { uuid } = params;

  return <SpacePage uuid={uuid} />;
}
