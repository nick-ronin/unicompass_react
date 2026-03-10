import TaskCard from '@/components/Task Card';

export default function TasksPage() {
  return (
    <div className='px-48 pb-8 gap-24 flex flex-col'>
      <div className=''>
        
      </div>
      <TaskCard name='Task 1' description='Description 1' deadline='2023-09-01' />
      <TaskCard name='Task 2' description='Description 2' deadline='2023-09-02' />
      <TaskCard name='Task 3' description='Description 3' deadline='2023-09-03' />
    </div>
  );
}
