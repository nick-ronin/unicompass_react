import Image from 'next/image';
import Link from 'next/link';

const translations = {
    ru: {
        copyright: '© 2026, Институт космических и информационных технологий, СФУ',
        sfu: 'Сибирский федеральный университет',
        icit: 'ИКИТ',
        mySfu: 'Мой СФУ',
        ecourses: 'Электронные курсы',
        personalData: 'Согласие на обработку персональных данных',
        privacy: 'Политика конфиденциальности',
        acceptableUse: 'Политика допустимого использования',
    },
    en: {
        copyright: '© 2026, Institute of Space and Information Technologies, Siberian Federal University',
        sfu: 'Siberian Federal University',
        icit: 'ICIT',
        mySfu: 'My Siberian Federal University',
        ecourses: 'E-courses',
        personalData: 'Personal data agreement',
        privacy: 'Privacy policy',
        acceptableUse: 'Acceptable use policy',
    },
};

export default function Footer({ lang = 'ru' }: { lang?: 'ru' | 'en' }) {
    const t = translations[lang] || translations.ru;

    return (
        <div className='flex space-between bg-light-blue-gray dark:bg-surface px-12 py-3 rounded-2xl gap-24 items-center'>
            <Image src='/logo/a+.png' alt='Unicompass Logo' width={120} height={40} />
            <Link href='https://fadm.gov.ru/directions/grant/'>
                <Image src='/rosmol-black.png' alt='rosmol-black' width={120} height={40} />
            </Link>
            <p className='max-w-sm text-sm'>{t.copyright}</p>
            <div className='flex flex-col'>
                <div className='flex gap-4'>
                    <Link href='https://sfu.ru/' className='text-sm hover:underline'>{t.sfu}</Link>
                    <Link href='https://ikit.sfu-kras.ru/' className='text-sm hover:underline'>{t.icit}</Link>
                    <Link href='https://i.sfu-kras.ru/' className='text-sm hover:underline'>{t.mySfu}</Link>
                    <Link href='https://e.sfu-kras.ru/' className='text-sm hover:underline'>{t.ecourses}</Link>
                </div>
                <div className=''>
                    <Link href='/' className='text-sm hover:underline'>{t.personalData}</Link>
                </div>
                <div className='flex flex-row gap-2'>
                    <Link href='/' className='text-sm hover:underline'>{t.privacy}</Link>
                    <Link href='/' className='text-sm hover:underline'>{t.acceptableUse}</Link>
                </div>
            </div>
        </div>
    );
}