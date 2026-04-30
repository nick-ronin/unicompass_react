'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button';
import InputField from '@/components/Input Field';
import MaterialIcon from '@/components/MaterialIcon';

type KnowledgeArticle = {
  id: string;
  title: string;
  summary: string;
  section: string;
  audience: string;
  status: 'draft' | 'published';
  tags: string;
  body: string;
  updatedAt: string;
};

const translations = {
  ru: {
    title: 'База знаний',
    subtitle: 'Админский контент-центр: редактируйте статьи, черновики и разделы без API, прямо в интерфейсе.',
    note: 'Изменения сохраняются локально в браузере, пока не подключены серверные эндпоинты.',
    addArticle: 'Новая статья',
    duplicate: 'Дублировать',
    remove: 'Удалить',
    save: 'Сохранить локально',
    reset: 'Сбросить',
    articleList: 'Статьи и материалы',
    editor: 'Редактор статьи',
    quickView: 'Быстрый просмотр разделов',
    stats: {
      total: 'Статей',
      drafts: 'Черновиков',
      published: 'Опубликованных',
      sections: 'Разделов',
    },
    form: {
      title: 'Заголовок',
      summary: 'Краткое описание',
      section: 'Раздел',
      audience: 'Для кого',
      status: 'Статус',
      tags: 'Теги через запятую',
      body: 'Текст статьи',
      sectionPlaceholder: 'Например: Учеба',
      audiencePlaceholder: 'Например: Студенты 1 курса',
      bodyPlaceholder: 'Опишите шаги, требования и полезные ссылки.',
    },
    sections: {
      study: 'Учеба',
      events: 'Мероприятия',
      dormitory: 'Общежитие',
      documents: 'Документы',
      contacts: 'Контакты',
    },
    statuses: {
      draft: 'Черновик',
      published: 'Опубликовано',
    },
  },
  en: {
    title: 'Knowledge base',
    subtitle: 'Admin content hub: edit articles, drafts, and sections without an API, directly in the UI.',
    note: 'Changes are stored locally in the browser until server endpoints are connected.',
    addArticle: 'New article',
    duplicate: 'Duplicate',
    remove: 'Delete',
    save: 'Save locally',
    reset: 'Reset',
    articleList: 'Articles and materials',
    editor: 'Article editor',
    quickView: 'Section overview',
    stats: {
      total: 'Articles',
      drafts: 'Drafts',
      published: 'Published',
      sections: 'Sections',
    },
    form: {
      title: 'Title',
      summary: 'Short summary',
      section: 'Section',
      audience: 'Audience',
      status: 'Status',
      tags: 'Tags separated by commas',
      body: 'Article text',
      sectionPlaceholder: 'For example: Study',
      audiencePlaceholder: 'For example: First-year students',
      bodyPlaceholder: 'Describe steps, requirements, and useful links.',
    },
    sections: {
      study: 'Study',
      events: 'Events',
      dormitory: 'Dormitory',
      documents: 'Documents',
      contacts: 'Contacts',
    },
    statuses: {
      draft: 'Draft',
      published: 'Published',
    },
  },
};

const sectionOrder = ['study', 'events', 'dormitory', 'documents', 'contacts'] as const;

const buildInitialArticles = (lang: keyof typeof translations): KnowledgeArticle[] => {
  const isEnglish = lang === 'en';

  return [
    {
      id: 'study-registration',
      title: isEnglish ? 'Course registration guide' : 'Как записаться на курс',
      summary: isEnglish
        ? 'Step-by-step instructions for course enrollment and approval.'
        : 'Пошаговая инструкция по записи на дисциплины и согласованию.',
      section: isEnglish ? 'Study' : 'Учеба',
      audience: isEnglish ? 'Undergraduates' : 'Студенты бакалавриата',
      status: 'published',
      tags: isEnglish ? 'study, registration, courses' : 'учеба, запись, дисциплины',
      body: isEnglish
        ? '1. Open the catalog.\n2. Check prerequisites.\n3. Confirm the request with the dean office.\n4. Add a help link if the flow changes.'
        : '1. Откройте каталог.\n2. Проверьте пререквизиты.\n3. Подтвердите заявку в деканате.\n4. Добавьте ссылку на поддержку, если процесс изменится.',
      updatedAt: '2026-04-26',
    },
    {
      id: 'dormitory-movein',
      title: isEnglish ? 'Dorm move-in checklist' : 'Чек-лист заселения в общежитие',
      summary: isEnglish
        ? 'Documents, deadlines, and what to bring for move-in day.'
        : 'Документы, сроки и что взять с собой в день заселения.',
      section: isEnglish ? 'Dormitory' : 'Общежитие',
      audience: isEnglish ? 'Residents' : 'Проживающие студенты',
      status: 'draft',
      tags: isEnglish ? 'dorm, housing, checklist' : 'общежитие, заселение, список',
      body: isEnglish
        ? 'Prepare the contract, passport copies, and receipt. Add an admin note for the check-in desk and a map if needed.'
        : 'Подготовьте договор, копии паспорта и квитанцию. Добавьте заметку для стойки заселения и карту, если нужно.',
      updatedAt: '2026-04-25',
    },
    {
      id: 'documents-certificates',
      title: isEnglish ? 'Certificate request flow' : 'Порядок заказа справок',
      summary: isEnglish
        ? 'Common certificate types and how to request them.'
        : 'Популярные типы справок и как их запросить.',
      section: isEnglish ? 'Documents' : 'Документы',
      audience: isEnglish ? 'Students and staff' : 'Студенты и сотрудники',
      status: 'published',
      tags: isEnglish ? 'documents, certificates, requests' : 'документы, справки, заявки',
      body: isEnglish
        ? 'List the common certificate types, add a request form link, and note the expected processing time.'
        : 'Укажите типы справок, добавьте ссылку на форму заявки и время обработки.',
      updatedAt: '2026-04-24',
    },
  ];
};

const makeArticleId = (title: string) =>
  `${title.trim().toLowerCase().replace(/[^a-z0-9а-яё]+/gi, '-') || 'article'}-${Date.now().toString(36)}`;

export default function AdminKnowledgeBasePage() {
  const params = useParams();
  const lang = ((params?.lang as string) || 'ru') as keyof typeof translations;
  const t = translations[lang] || translations.ru;
  const storageKey = `admin-knowledge-base-${lang}`;

  const [articles, setArticles] = useState<KnowledgeArticle[]>(() => buildInitialArticles(lang));
  const [selectedId, setSelectedId] = useState<string>(() => buildInitialArticles(lang)[0]?.id || '');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedValue = window.localStorage.getItem(storageKey);
    if (!savedValue) return;

    try {
      const parsed = JSON.parse(savedValue) as KnowledgeArticle[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setArticles(parsed);
        setSelectedId(parsed[0].id);
      }
    } catch (error) {
      console.warn('Failed to load knowledge base draft', error);
    }
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(storageKey, JSON.stringify(articles));
  }, [articles, storageKey]);

  const selectedArticle = articles.find((article) => article.id === selectedId) || articles[0];

  useEffect(() => {
    if (!selectedArticle) return;
    if (selectedArticle.id !== selectedId) {
      setSelectedId(selectedArticle.id);
    }
  }, [selectedArticle, selectedId]);

  const stats = useMemo(() => {
    const draftCount = articles.filter((article) => article.status === 'draft').length;
    const sectionsCount = new Set(articles.map((article) => article.section)).size;

    return [
      { label: t.stats.total, value: articles.length },
      { label: t.stats.drafts, value: draftCount },
      { label: t.stats.published, value: articles.length - draftCount },
      { label: t.stats.sections, value: sectionsCount },
    ];
  }, [articles, t.stats]);

  const sectionCards = useMemo(() => {
    return sectionOrder.map((sectionKey) => {
      const sectionTitle = t.sections[sectionKey];
      return {
        key: sectionKey,
        title: sectionTitle,
        count: articles.filter((article) => article.section === sectionTitle).length,
      };
    });
  }, [articles, t.sections]);

  const updateSelected = <K extends keyof KnowledgeArticle>(field: K, value: KnowledgeArticle[K]) => {
    if (!selectedArticle) return;
    setArticles((current) => current.map((article) => article.id === selectedArticle.id ? { ...article, [field]: value, updatedAt: new Date().toISOString().slice(0, 10) } : article));
  };

  const handleAddArticle = () => {
    const newArticle: KnowledgeArticle = {
      id: makeArticleId(lang === 'en' ? 'new-article' : 'new-article'),
      title: lang === 'en' ? 'New article' : 'Новая статья',
      summary: lang === 'en' ? 'Add the summary for this article.' : 'Добавьте краткое описание статьи.',
      section: t.sections.study,
      audience: lang === 'en' ? 'All users' : 'Все пользователи',
      status: 'draft',
      tags: lang === 'en' ? 'draft, kb' : 'черновик, база знаний',
      body: lang === 'en' ? 'Start writing the article body here.' : 'Начните заполнять текст статьи здесь.',
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    setArticles((current) => [newArticle, ...current]);
    setSelectedId(newArticle.id);
  };

  const handleDuplicate = () => {
    if (!selectedArticle) return;

    const duplicated: KnowledgeArticle = {
      ...selectedArticle,
      id: makeArticleId(selectedArticle.title),
      title: `${selectedArticle.title} (${lang === 'en' ? 'copy' : 'копия'})`,
      status: 'draft',
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    setArticles((current) => [duplicated, ...current]);
    setSelectedId(duplicated.id);
  };

  const handleDelete = () => {
    if (!selectedArticle) return;

    setArticles((current) => {
      const next = current.filter((article) => article.id !== selectedArticle.id);
      setSelectedId(next[0]?.id || '');
      return next;
    });
  };

  const handleReset = () => {
    const initial = buildInitialArticles(lang);
    setArticles(initial);
    setSelectedId(initial[0]?.id || '');
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(storageKey);
    }
  };

  return (
    <div className='px-4 py-8 sm:px-6 md:px-12 lg:px-16 xl:px-24'>
      <div className='mb-8 flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-cyan via-dark-cyan to-dark-yellow px-6 py-8 text-white shadow-lg sm:px-8 sm:py-10'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div>
            <p className='text-sm uppercase tracking-[0.2em] text-white/70'>{lang === 'en' ? 'Admin workspace' : 'Админская зона'}</p>
            <h1 className='mt-2 text-3xl font-extrabold sm:text-4xl'>{t.title}</h1>
          </div>
          <Link href={`/${lang}/student/knowledge-base`} className='inline-flex items-center gap-2 rounded-2xl border border-white/40 px-4 py-3 text-sm font-semibold transition-colors hover:bg-white/10'>
            <MaterialIcon name='visibility' className='text-base' />
            {lang === 'en' ? 'Open student view' : 'Открыть студенческий вид'}
          </Link>
        </div>
        <p className='max-w-4xl text-base text-white/90 sm:text-lg'>{t.subtitle}</p>
        <p className='text-sm text-white/80'>{t.note}</p>
      </div>

      <div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-4'>
        {stats.map((stat) => (
          <div key={stat.label} className='rounded-2xl border border-gray/10 bg-white p-5 shadow-sm dark:border-medium-blue-gray/30 dark:bg-surface'>
            <p className='text-sm text-medium-blue-gray dark:text-gray'>{stat.label}</p>
            <p className='mt-2 text-3xl font-extrabold text-dark-gray dark:text-white'>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className='mb-8 grid grid-cols-1 gap-4 lg:grid-cols-5'>
        {sectionCards.map((section) => (
          <div key={section.key} className='rounded-2xl border border-gray/10 bg-light-gray/40 p-5 dark:border-medium-blue-gray/30 dark:bg-dark-gray'>
            <p className='text-sm text-medium-blue-gray dark:text-gray'>{t.quickView}</p>
            <p className='mt-2 text-xl font-bold text-dark-gray dark:text-white'>{section.title}</p>
            <p className='mt-1 text-sm text-medium-blue-gray dark:text-gray'>{section.count} {lang === 'en' ? 'articles' : 'статей'}</p>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 gap-6 xl:grid-cols-[360px_1fr]'>
        <section className='rounded-3xl border border-gray/10 bg-white p-5 shadow-sm dark:border-medium-blue-gray/30 dark:bg-surface'>
          <div className='mb-4 flex items-center justify-between gap-3'>
            <h2 className='text-2xl font-bold text-dark-gray dark:text-white'>{t.articleList}</h2>
            <Button onClick={handleAddArticle} className='bg-dark-cyan text-white hover:bg-cyan'>
              <MaterialIcon name='add' className='text-base' />
              {t.addArticle}
            </Button>
          </div>

          <div className='flex flex-col gap-3'>
            {articles.map((article) => {
              const isActive = article.id === selectedId;
              return (
                <button
                  key={article.id}
                  type='button'
                  onClick={() => setSelectedId(article.id)}
                  className={`rounded-2xl border p-4 text-left transition-colors ${isActive ? 'border-dark-cyan bg-cyan/5' : 'border-gray/10 bg-light-gray/30 hover:border-dark-cyan/40 dark:border-medium-blue-gray/30 dark:bg-dark-gray'}`}
                >
                  <div className='flex items-start justify-between gap-3'>
                    <div>
                      <p className='text-xs uppercase tracking-[0.18em] text-medium-blue-gray dark:text-gray'>{article.section}</p>
                      <h3 className='mt-1 text-lg font-semibold text-dark-gray dark:text-white'>{article.title}</h3>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${article.status === 'published' ? 'bg-light-green/20 text-dark-cyan' : 'bg-dark-yellow/15 text-dark-yellow'}`}>
                      {t.statuses[article.status]}
                    </span>
                  </div>
                  <p className='mt-3 text-sm text-medium-blue-gray dark:text-gray'>{article.summary}</p>
                  <p className='mt-3 text-xs text-medium-blue-gray dark:text-gray'>{article.updatedAt}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className='rounded-3xl border border-gray/10 bg-white p-5 shadow-sm dark:border-medium-blue-gray/30 dark:bg-surface'>
          <div className='mb-5 flex flex-wrap items-center justify-between gap-3'>
            <div>
              <h2 className='text-2xl font-bold text-dark-gray dark:text-white'>{t.editor}</h2>
              <p className='text-sm text-medium-blue-gray dark:text-gray'>{lang === 'en' ? 'Edit the active draft and keep the content ready for API integration.' : 'Редактируйте активный черновик и готовьте контент к подключению API.'}</p>
            </div>
            <div className='flex flex-wrap gap-2'>
              <Button onClick={handleDuplicate} className='border border-gray/15 bg-transparent text-dark-gray hover:bg-light-gray dark:border-medium-blue-gray/40 dark:text-white dark:hover:bg-dark-gray'>
                <MaterialIcon name='content_copy' className='text-base' />
                {t.duplicate}
              </Button>
              <Button onClick={handleDelete} className='border border-orange/40 bg-orange/10 text-dark-orange hover:bg-orange/15'>
                <MaterialIcon name='delete' className='text-base' />
                {t.remove}
              </Button>
              <Button onClick={handleReset} className='bg-light-blue-gray text-dark-gray hover:bg-medium-blue-gray/30 dark:bg-dark-gray dark:text-white'>
                <MaterialIcon name='restart_alt' className='text-base' />
                {t.reset}
              </Button>
            </div>
          </div>

          {selectedArticle ? (
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              <InputField
                value={selectedArticle.title}
                onChange={(event) => updateSelected('title', event.target.value)}
                placeholder={t.form.title}
                containerClassName='w-full'
                disableDarkTheme
              />
              <InputField
                value={selectedArticle.audience}
                onChange={(event) => updateSelected('audience', event.target.value)}
                placeholder={t.form.audiencePlaceholder}
                containerClassName='w-full'
                disableDarkTheme
              />
              <InputField
                value={selectedArticle.section}
                onChange={(event) => updateSelected('section', event.target.value)}
                placeholder={t.form.sectionPlaceholder}
                containerClassName='w-full'
                disableDarkTheme
              />
              <InputField
                value={selectedArticle.status}
                onChange={(event) => updateSelected('status', event.target.value as KnowledgeArticle['status'])}
                placeholder={t.form.status}
                containerClassName='w-full'
                disableDarkTheme
              />
              <div className='lg:col-span-2'>
                <InputField
                  value={selectedArticle.summary}
                  onChange={(event) => updateSelected('summary', event.target.value)}
                  placeholder={t.form.summary}
                  containerClassName='w-full'
                  disableDarkTheme
                />
              </div>
              <div className='lg:col-span-2'>
                <InputField
                  value={selectedArticle.tags}
                  onChange={(event) => updateSelected('tags', event.target.value)}
                  placeholder={t.form.tags}
                  containerClassName='w-full'
                  disableDarkTheme
                />
              </div>
              <div className='lg:col-span-2'>
                <label className='mb-2 block text-sm font-medium text-medium-blue-gray dark:text-gray'>{t.form.body}</label>
                <textarea
                  value={selectedArticle.body}
                  onChange={(event) => updateSelected('body', event.target.value)}
                  placeholder={t.form.bodyPlaceholder}
                  rows={10}
                  className='w-full rounded-2xl bg-light-blue-gray px-4 py-3 text-black outline-none transition-colors duration-150 focus:bg-white focus:ring-2 focus:ring-cyan dark:bg-dark-gray dark:text-white dark:focus:bg-surface dark:focus:ring-dark-cyan'
                />
              </div>
              <div className='lg:col-span-2 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray/10 bg-light-gray/30 px-4 py-3 dark:border-medium-blue-gray/30 dark:bg-dark-gray'>
                <div>
                  <p className='text-sm text-medium-blue-gray dark:text-gray'>{lang === 'en' ? 'Last updated' : 'Последнее обновление'}</p>
                  <p className='text-base font-semibold text-dark-gray dark:text-white'>{selectedArticle.updatedAt}</p>
                </div>
                <Button onClick={() => setArticles((current) => current.map((article) => article.id === selectedArticle.id ? { ...article, updatedAt: new Date().toISOString().slice(0, 10) } : article))} className='bg-dark-cyan text-white hover:bg-cyan'>
                  <MaterialIcon name='save' className='text-base' />
                  {t.save}
                </Button>
              </div>
            </div>
          ) : (
            <div className='rounded-2xl border border-dashed border-gray/20 p-8 text-center text-medium-blue-gray dark:border-medium-blue-gray/30 dark:text-gray'>
              {lang === 'en' ? 'No article selected yet.' : 'Пока не выбрана статья.'}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}