import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
    return (
        <div className='flex space-between bg-light-blue-gray dark:bg-surface px-12 py-3 rounded-2xl gap-24 items-center'>
            <Image src='/logo/Logo.svg' width={95} height={40} alt='Logo'></Image>
            <p className='max-w-sm text-sm'>© 2026, Институт космических и информационных технологий Сибирского федерального университета</p>
            <div className='flex flex-col'>
                <div className='flex gap-4'>
                    <Link href='https://sfu.ru/' className='text-sm hover:underline'>СФУ</Link>
                    <Link href='https://ikit.sfu-kras.ru/' className='text-sm hover:underline'>ИКИТ</Link>
                    <Link href='https://i.sfu-kras.ru/' className='text-sm hover:underline'>Мой СФУ</Link>
                    <Link href='https://e.sfu-kras.ru/' className='text-sm hover:underline'>еКурсы</Link>
                </div>
                <div className=''>
                    <Link href='/' className='text-sm hover:underline'>Соглашение о персональных данных</Link>
                </div>
                <div className='flex flex-row gap-2'>
                    <Link href='/' className='text-sm hover:underline'>Политика конфиденциальности</Link>
                    <Link href='/' className='text-sm hover:underline'>Политика допустимого использования</Link>
                </div>
            </div>
        </div>
    );
}