'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

const translations = {
    ru: {
        copyright: '© 2026, Институт космических и информационных технологий, СФУ',
        sfu: 'СФУ',
        icit: 'ИКИТ',
        mySfu: 'Мой СФУ',
        ecourses: 'еКурсы',
        personalData: 'Согласие на обработку персональных данных',
        privacy: 'Политика конфиденциальности',
        acceptableUse: 'Политика допустимого использования',
    },
    en: {
        copyright: '© 2026, Institute of Space and Information Technologies, Siberian Federal University',
        sfu: 'SibFU',
        icit: 'ICIT',
        mySfu: 'My Siberian Federal University',
        ecourses: 'eCourses',
        personalData: 'Personal data agreement',
        privacy: 'Privacy policy',
        acceptableUse: 'Acceptable use policy',
    },
};

export default function Footer({ lang = 'ru' }: { lang?: 'ru' | 'en' }) {
    const t = translations[lang] || translations.ru;
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const isDark = mounted && resolvedTheme === 'dark';
    const aLogoSrc = isDark ? '/logo/a+white.png' : '/logo/a+black.png';
    const rosmolLogoSrc = isDark ? '/rosmol-white.png' : '/rosmol-black.png';

    return (
        <div className='flex flex-col items-start gap-4 rounded-2xl bg-light-blue-gray px-4 py-4 dark:bg-surface sm:flex-row sm:flex-wrap sm:items-center sm:gap-8 sm:px-6 lg:px-12'>
            <Image src={aLogoSrc} alt='A+ Logo' width={120} height={40} className='h-4 w-auto sm:h-6' />
            <Link href='https://fadm.gov.ru/directions/grant/' className='shrink-0'>
                <Image src={rosmolLogoSrc} alt='Rosmol Logo' width={120} height={40} className='h-14 w-auto sm:h-16' />
            </Link>
            <p className='max-w-none text-sm leading-relaxed sm:max-w-sm'>{t.copyright}</p>
            <div className='flex flex-col gap-2'>
                <div className='flex flex-wrap gap-x-4 gap-y-2'>
                    <Link href='https://sfu.ru/' className='text-sm hover:underline'>{t.sfu}</Link>
                    <Link href='https://ikit.sfu-kras.ru/' className='text-sm hover:underline'>{t.icit}</Link>
                    <Link href='https://i.sfu-kras.ru/' className='text-sm hover:underline'>{t.mySfu}</Link>
                    <Link href='https://e.sfu-kras.ru/' className='text-sm hover:underline'>{t.ecourses}</Link>
                </div>
                <div className='flex flex-col gap-1'>
                    <Link href='/' className='text-sm hover:underline'>{t.personalData}</Link>
                    <Link href='/' className='text-sm hover:underline'>{t.privacy}</Link>
                    <Link href='/' className='text-sm hover:underline'>{t.acceptableUse}</Link>
                </div>
            </div>
        </div>
    );
}