import { cookies } from 'next/headers';

import { TASK_STATUS } from '@prisma/client';
import { getUserFromCookie } from '@/lib/auth';
import { db } from '@/lib/db';

import Button from '@/components/Button';
import Card from '@/components/Card';
import { getTranslation } from '@/i18n/getDictionary';
import { ValidLocale } from '@/i18n/i18n-config';
import { taskProps } from '@/lib/Types';

const getScript = async (lang: ValidLocale) => {
  const translate = await getTranslation(lang);

  const projectScript = {
    newTask: translate('project.newTask'),
    null: translate('project.null'),
  };
  return projectScript;
};

const getData = async () => {
  const user = await getUserFromCookie(cookies());
  const tasks = await db.task.findMany({
    where: {
      ownerId: user?.id,
      NOT: {
        status: TASK_STATUS.COMPLETED,
        deleted: false,
      },
    },
    take: 5,
    orderBy: {
      due: 'asc',
    },
  });

  return tasks;
};

const TasksCard = async ({ title, tasks, lang }: taskProps) => {
  const data = tasks || (await getData());
  const projectScript = await getScript(lang);

  return (
    <Card>
      <div className="flex justify-between items-center">
        <div>
          <span className="text-3xl text-gray-600">{title}</span>
        </div>
        <div>
          <Button intent="text" className="text-violet-600">
            {projectScript.newTask}
          </Button>
        </div>
      </div>
      <div>
        {data && data.length ? (
          <div>
            {data.map((task) => (
              <div className="py-2" key={task.name}>
                <div>
                  <span className="text-gray-800">{task.name}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">
                    {task.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>{projectScript.null}</div>
        )}
      </div>
    </Card>
  );
};

export default TasksCard;
