import TaskCard from '@/components/Task Card';
import Dropdown from '@/components/Dropdown';
import InputField from '@/components/Input Field';

export default function TasksPage() {
  return (
    <div className='min-h-screen dark:bg-surface py-12 px-6 md:px-12 lg:px-16'>
      {/* Header Section */}
      <div className='max-w-7xl mx-auto mb-12'>
        <div className='mb-8'>
          <h1 className='text-4xl md:text-5xl font-bold text-dark-gray dark:text-white mb-2'>
            Мои задачи
          </h1>
          <p className='text-lg text-medium-blue-gray dark:text-gray'>
            Управляйте и отслеживайте ваши задачи в одном месте
          </p>
        </div>

        {/* Controls Section */}
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-8 items-end'>
          <Dropdown 
            options={['Название', 'Срок', 'Статус']} 
            className='text-base' 
            label='Сортировка'
          />
          <Dropdown 
            options={['Все', 'Выполнено', 'В процессе', 'Не выполнено']} 
            className='text-base' 
            label='Фильтр'
          />
          <div className=''>
            <InputField icon={<span className='material-symbols-outlined'>search</span>} placeholder='Поиск задач...' className='focus:bg-white'/>
          </div>
        </div>

        {/* Stats Section */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
          <div className='bg-white dark:bg-surface rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-cyan'>
            <div className='flex items-center justify-between mb-4'>
              <span className='material-symbols-outlined text-cyan text-4xl'>assignment</span>
            </div>
            <p className='text-medium-blue-gray dark:text-gray text-sm font-medium mb-2'>Всего задач</p>
            <p className='text-5xl font-bold bg-gradient-to-r from-cyan to-dark-cyan bg-clip-text text-transparent'>8</p>
            <div className='mt-4 w-full bg-light-blue-gray dark:bg-surface-secondary rounded-full h-2'>
              <div className='bg-gradient-to-r from-cyan to-dark-cyan h-2 rounded-full' style={{width: '100%'}}></div>
            </div>
          </div>

          <div className='bg-white dark:bg-surface rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-light-green'>
            <div className='flex items-center justify-between mb-4'>
              <span className='material-symbols-outlined text-light-green text-4xl'>check_circle</span>
            </div>
            <p className='text-medium-blue-gray dark:text-gray text-sm font-medium mb-2'>Выполнено</p>
            <p className='text-5xl font-bold bg-gradient-to-r from-light-green to-cyan bg-clip-text text-transparent'>3</p>
            <div className='mt-4 w-full bg-light-blue-gray dark:bg-surface-secondary rounded-full h-2'>
              <div className='bg-gradient-to-r from-light-green to-cyan h-2 rounded-full' style={{width: '37.5%'}}></div>
            </div>
          </div>

          <div className='bg-white dark:bg-surface rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-orange'>
            <div className='flex items-center justify-between mb-4'>
              <span className='material-symbols-outlined text-orange text-4xl'>priority_high</span>
            </div>
            <p className='text-medium-blue-gray dark:text-gray text-sm font-medium mb-2'>Срочные</p>
            <p className='text-5xl font-bold bg-gradient-to-r from-orange to-dark-orange bg-clip-text text-transparent'>2</p>
            <div className='mt-4 w-full bg-light-blue-gray dark:bg-surface-secondary rounded-full h-2'>
              <div className='bg-gradient-to-r from-orange to-dark-orange h-2 rounded-full' style={{width: '25%'}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Tasks Section */}
      <div className='max-w-7xl mx-auto mb-12'>
        <div className='bg-gradient-to-r from-orange via-light-orange to-yellow rounded-3xl shadow-xl p-8 md:p-10'>
          <div className='flex items-center gap-3 mb-6'>
            <span className='material-symbols-outlined text-white text-3xl'>priority_high</span>
            <h2 className='text-3xl font-bold text-white'>Срочные задачи</h2>
            <span className='ml-auto bg-white text-orange px-4 py-2 rounded-full font-bold text-lg'>3</span>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <TaskCard 
              name='Финальный отчет' 
              description='Подготовить финальный отчет по проекту' 
              deadline='2024-03-25'
              status='in-progress'
            />
            <TaskCard 
              name='Презентация' 
              description='Создать презентацию для семинара' 
              deadline='2024-03-24'
              status='not completed'
            />
            <TaskCard 
              name='Тестирование' 
              description='Провести тестирование компонентов' 
              deadline='2026-03-26'
              status='in-progress'
            />
          </div>
        </div>
      </div>

      {/* All Tasks Section */}
      <div className='max-w-7xl mx-auto'>
        <div className='mb-8'>
          <h2 className='text-3xl font-bold text-dark-gray dark:text-white flex items-center gap-3'>
            <span className='material-symbols-outlined text-cyan'>list</span>
            Все задачи
          </h2>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          <TaskCard 
            name='Исучение React' 
            description='Изучить основы React компонентов' 
            deadline='2024-03-28'
            status='completed'
          />
          <TaskCard 
            name='Документация' 
            description='Написать документацию API' 
            deadline='2024-03-27'
            status='in-progress'
          />
          <TaskCard 
            name='Код-ревью' 
            description='Проверить код коллег' 
            deadline='2024-03-29'
            status='not completed'
          />
          <TaskCard 
            name='Встреча' 
            description='Встреча с командой проекта' 
            deadline='2024-03-23'
            status='completed'
          />
          <TaskCard 
            name='Оптимизация' 
            description='Оптимизировать производительность' 
            deadline='2024-03-30'
            status='not completed'
          />
          <TaskCard 
            name='Дизайн' 
            description='Обновить дизайн интерфейса' 
            deadline='2024-03-31'
            status='in-progress'
          />
          <TaskCard 
            name='Баги' 
            description='Исправить критические ошибки' 
            deadline='2024-04-01'
            status='not completed'
          />
          <TaskCard 
            name='Deploy' 
            description='Развернуть на production' 
            deadline='2024-04-02'
            status='not completed'
          />
        </div>
      </div>
    </div>
  );
}
