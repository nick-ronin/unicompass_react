import InputField from '@/components/Input Field';
import UserChatCard from '@/components/User Chat Card';

export default function ChatPage() {
  return (
    <div className=''>
      <div className='flex flex-row bg-light-blue-gray dark:bg-dark-gray w-full'>
        <InputField icon={<span className='material-symbols-outlined'>search</span>} placeholder='Поиск' className='w-72 text-xl dark:bg-dark-gray'></InputField>
        <div className=''>

        </div>
      </div>
    </div>
  );
}
