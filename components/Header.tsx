import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className='py-4 px-12 bg-white text-black flex flex-row justify-between items-center'>
      <div className='flex gap-11 flex-row items-center text-xl'>
        <Link href='/'><Image src='/logo/Logo.svg' width={95} height={40} alt='UniCompass logo'/></Link>
        <div className='inline-block h-8 w-px bg-gray-400'></div>
        <Link className='hover:text-dark-orange' href='/'>Главная</Link>
        <Link className='hover:text-dark-orange' href='/calendar'>Календарь</Link>
        <Link className='hover:text-dark-orange' href='/knowledge-base'>База знаний</Link>
        <Link className='hover:text-dark-orange' href='/tasks'>Задачи</Link>
        <Link className='hover:text-dark-orange' href='/chat'>Чат</Link>
      </div>
      <div className='flex gap-6 justify-end'>
        <Link className='hover:text-dark-orange flex items-center' href='/notifications'><span className='icon'>notifications</span></Link>
        <button className='bg-dark-orange text-white hover:text-dark-orange hover:bg-white flex items-center px-6 py-3 rounded-2xl cursor-pointer'><span className='icon'>language</span></button>
        <Link href='/profile'><Image className='hover:stroke-black hover:fill-black' src='/NoAvatarDefault.svg' width={52} height={52} alt='No Avatar'/></Link>
      </div>
    </header>
  );
}