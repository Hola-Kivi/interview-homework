import { request } from '@/lib/requestXML';

type Props = {
  requestList: FormData[];
  MAX_POOL: number;
  onUploadProgress(e: ProgressEvent, i: number): void;
};

export default async function limit({
  requestList,
  MAX_POOL,
  onUploadProgress,
}: Props) {
  async function runTasks(tasksIterator: Array<FormData>) {
    for (let [i, values] of tasksIterator.entries()) {
      try {
        await request({
          data: values,
          method: 'POST',
          url: '/api/post',
          onUploadProgress,
          i,
        });
      } catch (error: any) {
        new Error(`Failed with: ${error.message}`);
      }
    }
  }
  const valve = Math.min(requestList.length, MAX_POOL);

  const workers = new Array(valve).fill(requestList).map(runTasks);

  return workers;
}
