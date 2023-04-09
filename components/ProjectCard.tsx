import { FC } from 'react';
import clsx from 'clsx';
import { Prisma } from '@prisma/client';

import Card from '@/components/Card';

const projectWithTasks = Prisma.validator<Prisma.ProjectArgs>()({
  include: { tasks: true },
});
type ProjectWithTasks = Prisma.ProjectGetPayload<typeof projectWithTasks>;

type Transcript = {
  completed: string;
};

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const ProjectCard: FC<{
  project: ProjectWithTasks;
  transcript: Transcript;
}> = ({ project, transcript }) => {
  const completedCount = project.tasks.filter(
    (t) => t.status === 'COMPLETED'
  ).length;

  const progress = Math.ceil((completedCount / project.tasks.length) * 100);

  return (
    <div className="py-4 px-6 w-60">
      <span className="text-sm md:text-base mb-7 text-purple-900 underline">
        {formatDate(project.createdAt)}
      </span>
      <div className="mb-6">
        <span className="text-3xl md:text-4xl lg:text-5xl text-gray-600">
          {project.name}
        </span>
      </div>
      <div className="mb-2">
        <span className="text-gray-400 text-sm md:text-base">
          {completedCount}/{project.tasks.length} {transcript.completed}
        </span>
      </div>
      <div>
        <div className="w-full h-2 bg-violet-200 rounded-full mb-2">
          <div
            className={clsx(
              'h-full text-center text-xs md:text-sm text-white bg-violet-600 rounded-full'
            )}
            style={{ width: `${progress || 0.1}%` }}
          ></div>
        </div>
        <div className="text-right">
          <span className="text-sm md:text-base text-gray-600 font-semibold">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
