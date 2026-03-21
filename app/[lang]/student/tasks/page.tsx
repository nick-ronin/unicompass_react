import TaskCard from '@/components/Task Card';
import Dropdown from '@/components/Dropdown';
import InputField from '@/components/Input Field';

export default function TasksPage() {
  return (
    <div className='px-48 py-8 flex flex-col'>
      <div className='flex flex-row justify-between'>
        <div className='flex flex-col gap-4 rounded-4xl outline-1 outline-dark-orange p-6'>
          <p className='text-dark-orange text-2xl font-extrabold'>Срочные задачи</p>
          <div className='flex flex-row gap-3'>
            <TaskCard name='Task 1' description='Description 1' deadline='2023-09-01' />
            <TaskCard name='Task 2' description='Description 2' deadline='2023-09-02' />
            <TaskCard name='Task 2' description='Description 2' deadline='2023-09-02' />
          </div>
        </div>
        <div className='flex flex-col items-center gap-6'>
          <InputField icon={<span className='material-symbols-outlined'>search</span>} placeholder='Найти задачу' className='w-133 text-xl'></InputField>
          <div className='flex flex-row gap-5'>
            <Dropdown options={['Название', 'Тип', 'Дедлайн']} className='text-xl w-64' label='Сортировка по'></Dropdown>
            <Dropdown options={['Название', 'Тип', 'Дедлайн']} className='text-xl w-64' label='Фильтр по'></Dropdown>
          </div>
          <div className='flex gap-8 items-center justify-center flex-row'>
            <div className='flex flex-col items-center gap-2 outline-2 outline-cyan rounded-4xl p-6'>
              <p className='text-4xl font-bold text-cyan'>8</p>
              <p className='text-lg'>Всего задач</p>
            </div>
            <div className='flex flex-col items-center gap-2 outline-2 outline-cyan rounded-4xl p-6'>
              <p className='text-4xl font-bold text-cyan'>3</p>
              <p className='text-lg'>Выполнено</p>
            </div>
            <div className='flex flex-col items-center gap-2 outline-2 outline-orange rounded-4xl p-6'>
              <p className='text-4xl font-bold text-orange'>2</p>
              <p className='text-lg'>Срочные</p>
            </div>
          </div>
        </div>
      </div>
      <div className='pt-12 flex flex-col gap-3'>
        <p className='text-2xl font-extrabold'>Все задачи</p>
          <div className='grid grid-cols-5 gap-4'>
            <TaskCard name='Task 2' description='Description 2' deadline='2023-09-02' />
            <TaskCard name='Task 2' description='Description 2' deadline='2023-09-02' />
            <TaskCard name='Task 2' description='Description 2' deadline='2023-09-02' />
            <TaskCard name='Task 2' description='Description 2' deadline='2023-09-02' />
            <TaskCard name='Task 2' description='Description 2' deadline='2023-09-02' />
            <TaskCard name='Task 2' description='Description 2' deadline='2023-09-02' />
            <TaskCard name='Task 2' description='Description 2' deadline='2023-09-02' />
            <TaskCard name='Task 2' description='Description 2' deadline='2023-09-02' />
          </div>
      </div>
    </div>
  );
}
