import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
    return (
        <div className='flex space-between bg-light-blue-gray px-12 py-3 rounded-2xl gap-32'>
            <Image src='/logo/Logo.svg' width={95} height={40} alt='Logo'></Image>
            <p className='max-w-sm'>© 2026, Институт космических и информационных технологий Сибирского федерального университета</p>
            <div className='flex flex-col'>
                <div className='flex gap-8'>
                    <Link href='https://sfu.ru/'>СФУ</Link>
                    <Link href='https://ikit.sfu-kras.ru/'>ИКИТ</Link>
                    <Link href='https://i.sfu-kras.ru/'>Мой СФУ</Link>
                    <Link href='https://e.sfu-kras.ru/'>еКурсы</Link>
                </div>
                <div className='flex gap-8'>
                    <Link href='/'>Соглашение о персональных данных</Link>
                </div>
                <div className='flex gap-8'>
                    <Link href='/'>Политика конфиденциальности</Link>
                    <Link href='/'>Политика допустимого использования</Link>
                </div>
            </div>
        </div>
    );
}