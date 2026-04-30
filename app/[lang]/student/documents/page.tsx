'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import InputField from '@/components/Input Field';
import Button from '@/components/Button';
import MaterialIcon from '@/components/MaterialIcon';

type DocumentItem = {
  id: string;
  title: string;
  description: string;
  purpose: string;
  category: string;
  icon: string;
  preview: string;
  href: string;
  actionLabel: string;
  accent: string;
};

const translations = {
  ru: {
    title: 'Документы',
    subtitle: 'Типовые формы, образцы заполнения, пустые шаблоны и личные файлы в одном месте.',
    searchPlaceholder: 'Найти документ, шаблон или образец',
    searchHint: 'Ищите по названию, описанию или назначению.',
    sections: 'Подборки',
    allDocuments: 'Все документы',
    empty: 'Ничего не найдено',
    clear: 'Сбросить поиск',
    documentsCount: 'документов',
    categories: {
      typical: 'Типовые документы',
      samples: 'Образцы заполнения',
      templates: 'Пустые шаблоны',
      user: 'Документы пользователя',
    },
    actions: {
      open: 'Открыть',
      download: 'Скачать',
      view: 'Просмотреть',
    },
  },
  en: {
    title: 'Documents',
    subtitle: 'Standard forms, filled examples, blank templates, and your personal files in one place.',
    searchPlaceholder: 'Find a document, template, or sample',
    searchHint: 'Search by title, description, or purpose.',
    sections: 'Collections',
    allDocuments: 'All documents',
    empty: 'Nothing found',
    clear: 'Clear search',
    documentsCount: 'documents',
    categories: {
      typical: 'Standard documents',
      samples: 'Filled samples',
      templates: 'Blank templates',
      user: 'User documents',
    },
    actions: {
      open: 'Open',
      download: 'Download',
      view: 'View',
    },
  },
};

const itemsByCategory: Record<keyof typeof translations.ru.categories, DocumentItem[]> = {
  typical: [
    {
      id: 'typical-registration',
      title: 'Памятка по регистрации',
      description: 'Базовый список шагов и документов для постановки на учет.',
      purpose: 'Помогает быстро понять, какие бумаги нужны в первую очередь.',
      category: 'typical',
      icon: 'description',
      preview: '/img/doc1.png',
      href: '/img/doc1.png',
      actionLabel: 'view',
      accent: 'from-cyan to-dark-cyan',
    },
    {
      id: 'typical-insurance',
      title: 'Страховой пакет',
      description: 'Перечень документов для оформления и продления страховки.',
      purpose: 'Подходит для первичного оформления и контроля сроков действия.',
      category: 'typical',
      icon: 'health_and_safety',
      preview: '/img/doc2.png',
      href: '/img/doc2.png',
      actionLabel: 'view',
      accent: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'typical-study',
      title: 'Учебные справки',
      description: 'Перечень справок, которые чаще всего запрашивают по учебе.',
      purpose: 'Нужен для академических запросов, переводов и подтверждений.',
      category: 'typical',
      icon: 'school',
      preview: '/img/doc3.png',
      href: '/img/doc3.png',
      actionLabel: 'open',
      accent: 'from-amber-400 to-orange-500',
    },
  ],
  samples: [
    {
      id: 'sample-application',
      title: 'Образец заявления',
      description: 'Заполненный пример заявления на распространенную услугу.',
      purpose: 'Показывает формат заполнения и типичные формулировки.',
      category: 'samples',
      icon: 'article',
      preview: '/img/doc4.png',
      href: '/img/doc4.png',
      actionLabel: 'download',
      accent: 'from-violet-500 to-fuchsia-500',
    },
    {
      id: 'sample-request',
      title: 'Образец запроса',
      description: 'Пример корректно оформленного запроса в деканат.',
      purpose: 'Полезен, если нужно быстро сверить структуру обращения.',
      category: 'samples',
      icon: 'request_quote',
      preview: '/img/doc5.png',
      href: '/img/doc5.png',
      actionLabel: 'download',
      accent: 'from-sky-500 to-blue-600',
    },
    {
      id: 'sample-cert',
      title: 'Образец справки',
      description: 'Визуальный пример справки для подачи в стороннюю организацию.',
      purpose: 'Помогает понять, какие поля должны быть заполнены.',
      category: 'samples',
      icon: 'badge',
      preview: '/img/doc6.jpg',
      href: '/img/doc6.jpg',
      actionLabel: 'download',
      accent: 'from-rose-500 to-orange-500',
    },
  ],
  templates: [
    {
      id: 'template-application',
      title: 'Пустой шаблон заявления',
      description: 'Чистый бланк без заполненных данных.',
      purpose: 'Скачайте и заполните вручную или на компьютере.',
      category: 'templates',
      icon: 'upload_file',
      preview: '/img/doc2.png',
      href: '/img/doc2.png',
      actionLabel: 'download',
      accent: 'from-slate-500 to-gray-700',
    },
    {
      id: 'template-request',
      title: 'Пустой шаблон запроса',
      description: 'Форма для подачи обращения без персональных данных.',
      purpose: 'Подходит для самостоятельного заполнения перед отправкой.',
      category: 'templates',
      icon: 'draft',
      preview: '/img/doc1.png',
      href: '/img/doc1.png',
      actionLabel: 'download',
      accent: 'from-indigo-500 to-cyan-600',
    },
    {
      id: 'template-certificate',
      title: 'Шаблон справки',
      description: 'Бланк для подготовки справки под конкретную задачу.',
      purpose: 'Полезен для быстрой подготовки документов с нуля.',
      category: 'templates',
      icon: 'receipt_long',
      preview: '/img/doc3.png',
      href: '/img/doc3.png',
      actionLabel: 'download',
      accent: 'from-cyan-500 to-blue-700',
    },
  ],
  user: [
    {
      id: 'user-passport',
      title: 'Паспорт',
      description: 'Загруженная копия паспорта с основными страницами.',
      purpose: 'Используется для идентификации и сверки данных.',
      category: 'user',
      icon: 'account_box',
      preview: '/img/doc5.png',
      href: '/img/doc5.png',
      actionLabel: 'download',
      accent: 'from-emerald-600 to-cyan-600',
    },
    {
      id: 'user-visa',
      title: 'Виза',
      description: 'Файл с текущей визой и отметками о сроке действия.',
      purpose: 'Нужен для актуального контроля легального статуса.',
      category: 'user',
      icon: 'travel_explore',
      preview: '/img/doc4.png',
      href: '/img/doc4.png',
      actionLabel: 'download',
      accent: 'from-amber-500 to-orange-600',
    },
    {
      id: 'user-statement',
      title: 'Личное заявление',
      description: 'Последний отправленный пользователем документ.',
      purpose: 'Удобно держать под рукой при повторной подаче.',
      category: 'user',
      icon: 'assignment',
      preview: '/img/doc6.jpg',
      href: '/img/doc6.jpg',
      actionLabel: 'open',
      accent: 'from-fuchsia-500 to-pink-600',
    },
  ],
};

const categoryOrder: (keyof typeof itemsByCategory)[] = ['typical', 'samples', 'templates', 'user'];

export default function StudentDocumentsPage() {
  const params = useParams();
  const lang = (params?.lang as string) || 'ru';
  const t = translations[lang as keyof typeof translations] || translations.ru;
  const [query, setQuery] = useState('');

  const normalizedQuery = query.trim().toLowerCase();

  const filteredGroups = useMemo(() => {
    return categoryOrder
      .map((category) => {
        const group = itemsByCategory[category];
        const filtered = group.filter((item) => {
          if (!normalizedQuery) return true;
          return [item.title, item.description, item.purpose, item.category]
            .join(' ')
            .toLowerCase()
            .includes(normalizedQuery);
        });

        return {
          category,
          items: filtered,
        };
      })
      .filter((group) => group.items.length > 0);
  }, [normalizedQuery]);

  const totalCount = categoryOrder.reduce((count, category) => count + itemsByCategory[category].length, 0);
  const visibleCount = filteredGroups.reduce((count, group) => count + group.items.length, 0);

  return (
    <div className='relative overflow-hidden px-4 pb-10 pt-6 sm:px-6 md:px-12 lg:px-16 xl:px-24'>
      <div className='mx-auto flex max-w-7xl flex-col gap-8'>
        <section className='overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-[0_20px_80px_rgba(14,165,233,0.12)] backdrop-blur dark:border-white/10 dark:bg-surface/90 sm:p-8 lg:p-10'>
          <div className='grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end'>
            <div className='space-y-4'>
              <div className='inline-flex items-center gap-2 rounded-full bg-dark-orange/10 px-4 py-2 text-sm font-medium text-dark-orange dark:bg-dark-orange/20'>
                <MaterialIcon name='folder' size='sm' />
                {t.title}
              </div>
              <div className='space-y-3'>
                <h1 className='max-w-3xl text-4xl font-black tracking-tight text-dark-gray dark:text-white sm:text-5xl lg:text-6xl'>
                  {t.title}
                </h1>
                <p className='max-w-2xl text-base leading-7 text-gray-700 dark:text-gray-300 sm:text-lg'>
                  {t.subtitle}
                </p>
              </div>
              <div className='flex flex-wrap gap-3 text-sm text-gray-700 dark:text-gray-300'>
                <span className='rounded-full bg-light-blue-gray px-4 py-2 dark:bg-dark-gray'>
                  {totalCount} {t.documentsCount}
                </span>
                <span className='rounded-full bg-light-blue-gray px-4 py-2 dark:bg-dark-gray'>
                  {categoryOrder.length} {t.sections.toLowerCase()}
                </span>
              </div>
            </div>

            <div className='rounded-[1.75rem] bg-light-blue-gray p-5 text-dark-gray dark:text-white shadow-xl dark:border-white/10 dark:bg-surface'>
              <div className='mb-4 flex items-center gap-3'>
                <div className='rounded-2xl bg-white/10 p-3 text-cyan'>
                  <MaterialIcon name='search' />
                </div>
                <div>
                  <p className='text-sm uppercase tracking-[0.2em] text-dark-gray dark:text-white/60'>{t.allDocuments}</p>
                  <p className='text-lg font-semibold text-dark-gray dark:text-white'>{visibleCount} / {totalCount}</p>
                </div>
              </div>
              <InputField
                icon={<MaterialIcon name='search' size='sm' />}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className='w-full text-base bg-white'
              />
              <p className='mt-3 text-sm leading-6 text-dark-gray dark:text-white/70'>{t.searchHint}</p>
            </div>
          </div>
        </section>

        <section className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {categoryOrder.map((category, index) => {
            const count = itemsByCategory[category].length;
            const label = t.categories[category];
            const palette = [
              'from-cyan to-dark-cyan',
              'from-emerald-500 to-teal-600',
              'from-amber-400 to-orange-500',
              'from-fuchsia-500 to-pink-600',
            ][index];

            return (
              <div key={category} className='rounded-[1.5rem] border border-white/60 bg-white/85 p-5 shadow-lg dark:border-white/10 dark:bg-surface'>
                <div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br ${palette} p-3 text-white`}>
                  <MaterialIcon name='description' />
                </div>
                <p className='text-base font-semibold text-dark-gray dark:text-white'>{label}</p>
                <p className='mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300'>
                  {count} {t.documentsCount}
                </p>
              </div>
            );
          })}
        </section>

        <div className='space-y-8'>
          {filteredGroups.map((group) => (
            <section key={group.category} className='space-y-4'>
              <div className='flex items-end justify-between gap-4'>
                <div>
                  <p className='text-sm font-semibold uppercase tracking-[0.24em] text-dark-orange dark:text-cyan'>
                    {t.sections}
                  </p>
                  <h2 className='mt-2 text-2xl font-black text-dark-gray dark:text-white sm:text-3xl'>
                    {t.categories[group.category]}
                  </h2>
                </div>
                <span className='hidden rounded-full bg-light-blue-gray px-4 py-2 text-sm text-gray-700 dark:bg-dark-gray dark:text-gray-200 sm:inline-flex'>
                  {group.items.length} {t.documentsCount}
                </span>
              </div>

              <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
                {group.items.map((item) => (
                  <article key={item.id} className='group overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/90 shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition-transform duration-300 hover:-translate-y-1 dark:border-white/10 dark:bg-surface'>
                    <div className={`relative h-44 bg-gradient-to-br ${item.accent} p-4 text-white`}>
                      <div className='flex items-start justify-between gap-3'>
                        <div className='inline-flex rounded-2xl bg-white/15 p-3 backdrop-blur'>
                          <MaterialIcon name={item.icon} />
                        </div>
                        <span className='rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] backdrop-blur'>
                          {t.categories[item.category as keyof typeof t.categories]}
                        </span>
                      </div>
                      <div className='absolute inset-x-4 bottom-4 overflow-hidden rounded-3xl border border-white/20 bg-white/15 p-2 backdrop-blur'>
                        <Image
                          src={item.preview}
                          alt={item.title}
                          width={600}
                          height={420}
                          className='h-32 w-full rounded-2xl object-cover shadow-lg'
                        />
                      </div>
                    </div>

                    <div className='flex h-full flex-col gap-4 p-5 pt-6'>
                      <div className='space-y-2'>
                        <h3 className='text-xl font-bold text-dark-gray dark:text-white'>{item.title}</h3>
                        <p className='text-sm leading-6 text-gray-700 dark:text-gray-300'>{item.description}</p>
                      </div>
                      <div className='rounded-2xl bg-light-blue-gray p-4 text-sm leading-6 text-gray-700 dark:bg-dark-gray dark:text-gray-300'>
                        <span className='font-semibold text-dark-gray dark:text-white'>{t.searchHint}</span> {item.purpose}
                      </div>
                      <div className='mt-auto flex flex-wrap gap-3'>
                        <Link href={item.href} className='inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-dark-gray px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-dark-orange dark:bg-white dark:text-dark-gray dark:hover:bg-cyan dark:hover:text-white' download>
                          <MaterialIcon name='download' size='sm' />
                          {t.actions.download}
                        </Link>
                        <Link href={item.href} className='inline-flex items-center justify-center gap-2 rounded-2xl border border-medium-blue-gray/30 px-4 py-3 text-sm font-semibold text-dark-gray transition-colors hover:border-dark-orange hover:text-dark-orange dark:border-white/15 dark:text-white dark:hover:border-cyan dark:hover:text-cyan'>
                          <MaterialIcon name='visibility' size='sm' />
                          {item.actionLabel === 'download' ? t.actions.view : t.actions.open}
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}

          {filteredGroups.length === 0 && (
            <div className='flex flex-col items-start gap-4 rounded-[1.75rem] border border-dashed border-medium-blue-gray/40 bg-white/80 p-8 text-dark-gray dark:border-white/10 dark:bg-surface dark:text-white'>
              <p className='text-2xl font-black'>{t.empty}</p>
              <p className='text-base text-gray-700 dark:text-gray-300'>{t.searchHint}</p>
              <Button onClick={() => setQuery('')} className='bg-cyan text-white hover:bg-dark-cyan dark:bg-cyan dark:hover:bg-dark-cyan'>
                {t.clear}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}