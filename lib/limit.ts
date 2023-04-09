import { request } from '@/components/NewPost';

export default async function limit(tasks: FormData[], concurrency: number) {
  async function runTasks(tasksIterator: Array<any>) {
    for (const values of tasksIterator) {
      try {
        await request({
          data: values,
          method: 'POST',
          url: '/api/post',
        });
      } catch (error: any) {
        new Error(`Failed with: ${error.message}`);
      }
    }
  }
  const valve = Math.min(tasks.length, concurrency);

  const workers = new Array(valve).fill(tasks.values()).map(runTasks);

  return workers;
}
