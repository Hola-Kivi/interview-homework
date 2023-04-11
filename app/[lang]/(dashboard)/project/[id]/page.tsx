import { cookies } from 'next/headers';

import { getUserFromCookie } from '@/lib/auth';
import { beSerializable } from '@/lib/beSerializable';
import { db } from '@/lib/db';

import TasksCard from '@/components/TasksCard';
import { ValidLocale } from '@/i18n/i18n-config';

const getData = async (id: string) => {
  const user = await getUserFromCookie(cookies());

  const project = await db.project.findFirst({
    where: { id, ownerId: user!.id },
    include: {
      tasks: true,
    },
  });
  return beSerializable(project);
};

type paramsProps = {
  params: {
    lang: ValidLocale;
    id: string;
  };
};
export default async function ProjectPage({ params }: paramsProps) {
  const project = await getData(params.id);
  if (!project) return;

  return (
    <div className="h-full overflow-y-auto px-6 flex items-center justify-center">
      {/* @ts-expect-error Server Component */}
      <TasksCard
        tasks={project.tasks}
        title={project.name}
        lang={params.lang}
      />
    </div>
  );
}
