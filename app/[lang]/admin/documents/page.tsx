'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button';
import InputField from '@/components/Input Field';
import MaterialIcon from '@/components/MaterialIcon';

type DocumentRecord = {
  id: string;
  title: string;
  description: string;
  purpose: string;
  category: string;
  fileType: string;
  source: string;
  actionLabel: string;
  preview: string;
  status: 'draft' | 'published';
  updatedAt: string;
};

const translations = {
  ru: {
    title: 'Документы',
    subtitle: 'Заготовка для наполнения шаблонами, справками и личными файлами без серверных запросов.',
    note: 'Редактируйте карточки, добавляйте новые документы и сохраняйте состояние локально до подключения API.',
    addDocument: 'Новый документ',
    duplicate: 'Дублировать',
    remove: 'Удалить',
    save: 'Сохранить локально',
    reset: 'Сбросить',
    documentList: 'Список документов',
    editor: 'Редактор документа',
    categorySummary: 'Подборки',
    stats: {
      total: 'Всего',
      drafts: 'Черновиков',
      published: 'Опубликованных',
      categories: 'Категорий',
    },
    form: {
      title: 'Название',
      description: 'Описание',
      purpose: 'Назначение',
      category: 'Категория',
      fileType: 'Тип файла',
      source: 'Источник / ссылка',
      actionLabel: 'Подпись действия',
      preview: 'Ссылка на превью',
      sectionPlaceholder: 'Например: Типовые документы',
      filePlaceholder: 'Например: PDF, DOCX, link',
      sourcePlaceholder: 'Например: /img/doc1.png или /files/template.pdf',
      previewPlaceholder: 'Превью файла или внешняя ссылка',
    },
    categories: {
      typical: 'Типовые документы',
      samples: 'Образцы заполнения',
      templates: 'Пустые шаблоны',
      user: 'Документы пользователя',
    },
    statuses: {
      draft: 'Черновик',
      published: 'Опубликовано',
    },
  },
  en: {
    title: 'Documents',
    subtitle: 'A starter workspace for templates, certificates, and personal files without server requests.',
    note: 'Edit cards, add new documents, and keep the state locally until the API is connected.',
    addDocument: 'New document',
    duplicate: 'Duplicate',
    remove: 'Delete',
    save: 'Save locally',
    reset: 'Reset',
    documentList: 'Document list',
    editor: 'Document editor',
    categorySummary: 'Collections',
    stats: {
      total: 'Total',
      drafts: 'Drafts',
      published: 'Published',
      categories: 'Categories',
    },
    form: {
      title: 'Title',
      description: 'Description',
      purpose: 'Purpose',
      category: 'Category',
      fileType: 'File type',
      source: 'Source / link',
      actionLabel: 'Action label',
      preview: 'Preview link',
      sectionPlaceholder: 'For example: Standard documents',
      filePlaceholder: 'For example: PDF, DOCX, link',
      sourcePlaceholder: 'For example: /img/doc1.png or /files/template.pdf',
      previewPlaceholder: 'File preview or external link',
    },
    categories: {
      typical: 'Standard documents',
      samples: 'Filled samples',
      templates: 'Blank templates',
      user: 'User documents',
    },
    statuses: {
      draft: 'Draft',
      published: 'Published',
    },
  },
};

const categoryOrder = ['typical', 'samples', 'templates', 'user'] as const;

const buildInitialDocuments = (lang: keyof typeof translations): DocumentRecord[] => {
  const isEnglish = lang === 'en';

  return [
    {
      id: 'registration-note',
      title: isEnglish ? 'Registration memo' : 'Памятка по регистрации',
      description: isEnglish
        ? 'Basic steps and a document list for registration.'
        : 'Базовый список шагов и документов для постановки на учет.',
      purpose: isEnglish
        ? 'Helps students understand what to prepare first.'
        : 'Помогает быстро понять, какие бумаги нужны в первую очередь.',
      category: 'typical',
      fileType: 'pdf',
      source: '/img/doc1.png',
      actionLabel: isEnglish ? 'View' : 'Просмотреть',
      preview: '/img/doc1.png',
      status: 'published',
      updatedAt: '2026-04-26',
    },
    {
      id: 'certificate-sample',
      title: isEnglish ? 'Certificate sample' : 'Образец справки',
      description: isEnglish
        ? 'Visual sample for submission to external organizations.'
        : 'Визуальный пример справки для подачи в стороннюю организацию.',
      purpose: isEnglish
        ? 'Shows which fields should be filled in.'
        : 'Помогает понять, какие поля должны быть заполнены.',
      category: 'samples',
      fileType: 'jpg',
      source: '/img/doc6.jpg',
      actionLabel: isEnglish ? 'Download' : 'Скачать',
      preview: '/img/doc6.jpg',
      status: 'draft',
      updatedAt: '2026-04-25',
    },
    {
      id: 'blank-template',
      title: isEnglish ? 'Blank application form' : 'Пустой шаблон заявления',
      description: isEnglish
        ? 'A clean form without prefilled data.'
        : 'Чистый бланк без заполненных данных.',
      purpose: isEnglish
        ? 'Download and fill it manually or on a computer.'
        : 'Скачайте и заполните вручную или на компьютере.',
      category: 'templates',
      fileType: 'docx',
      source: '/img/doc2.png',
      actionLabel: isEnglish ? 'Download' : 'Скачать',
      preview: '/img/doc2.png',
      status: 'published',
      updatedAt: '2026-04-24',
    },
    {
      id: 'user-passport',
      title: isEnglish ? 'Passport copy' : 'Паспорт',
      description: isEnglish
        ? 'Uploaded copy of the passport with the main pages.'
        : 'Загруженная копия паспорта с основными страницами.',
      purpose: isEnglish
        ? 'Used for identity checks and data matching.'
        : 'Используется для идентификации и сверки данных.',
      category: 'user',
      fileType: 'pdf',
      source: '/img/doc5.png',
      actionLabel: isEnglish ? 'Open' : 'Открыть',
      preview: '/img/doc5.png',
      status: 'draft',
      updatedAt: '2026-04-23',
    },
  ];
};

const makeDocumentId = (title: string) =>
  `${title.trim().toLowerCase().replace(/[^a-z0-9а-яё]+/gi, '-') || 'document'}-${Date.now().toString(36)}`;

export default function AdminDocumentsPage() {
  const params = useParams();
  const lang = ((params?.lang as string) || 'ru') as keyof typeof translations;
  const t = translations[lang] || translations.ru;
  const storageKey = `admin-documents-${lang}`;

  const [documents, setDocuments] = useState<DocumentRecord[]>(() => buildInitialDocuments(lang));
  const [selectedId, setSelectedId] = useState<string>(() => buildInitialDocuments(lang)[0]?.id || '');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedValue = window.localStorage.getItem(storageKey);
    if (!savedValue) return;

    try {
      const parsed = JSON.parse(savedValue) as DocumentRecord[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setDocuments(parsed);
        setSelectedId(parsed[0].id);
      }
    } catch (error) {
      console.warn('Failed to load documents draft', error);
    }
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(storageKey, JSON.stringify(documents));
  }, [documents, storageKey]);

  const selectedDocument = documents.find((document) => document.id === selectedId) || documents[0];

  useEffect(() => {
    if (!selectedDocument) return;
    if (selectedDocument.id !== selectedId) {
      setSelectedId(selectedDocument.id);
    }
  }, [selectedDocument, selectedId]);

  const stats = useMemo(() => {
    const draftCount = documents.filter((document) => document.status === 'draft').length;
    const categoriesCount = new Set(documents.map((document) => document.category)).size;

    return [
      { label: t.stats.total, value: documents.length },
      { label: t.stats.drafts, value: draftCount },
      { label: t.stats.published, value: documents.length - draftCount },
      { label: t.stats.categories, value: categoriesCount },
    ];
  }, [documents, t.stats]);

  const categoryCards = useMemo(() => {
    return categoryOrder.map((categoryKey) => ({
      key: categoryKey,
      title: t.categories[categoryKey],
      count: documents.filter((document) => document.category === categoryKey).length,
    }));
  }, [documents, t.categories]);

  const updateSelected = <K extends keyof DocumentRecord>(field: K, value: DocumentRecord[K]) => {
    if (!selectedDocument) return;
    setDocuments((current) => current.map((document) => document.id === selectedDocument.id ? { ...document, [field]: value, updatedAt: new Date().toISOString().slice(0, 10) } : document));
  };

  const handleAddDocument = () => {
    const newDocument: DocumentRecord = {
      id: makeDocumentId(lang === 'en' ? 'new-document' : 'new-document'),
      title: lang === 'en' ? 'New document' : 'Новый документ',
      description: lang === 'en' ? 'Add a short description.' : 'Добавьте краткое описание.',
      purpose: lang === 'en' ? 'Explain why this file exists.' : 'Укажите, зачем нужен этот файл.',
      category: 'typical',
      fileType: 'pdf',
      source: '/img/doc1.png',
      actionLabel: lang === 'en' ? 'View' : 'Просмотреть',
      preview: '/img/doc1.png',
      status: 'draft',
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    setDocuments((current) => [newDocument, ...current]);
    setSelectedId(newDocument.id);
  };

  const handleDuplicate = () => {
    if (!selectedDocument) return;

    const duplicated: DocumentRecord = {
      ...selectedDocument,
      id: makeDocumentId(selectedDocument.title),
      title: `${selectedDocument.title} (${lang === 'en' ? 'copy' : 'копия'})`,
      status: 'draft',
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    setDocuments((current) => [duplicated, ...current]);
    setSelectedId(duplicated.id);
  };

  const handleDelete = () => {
    if (!selectedDocument) return;

    setDocuments((current) => {
      const next = current.filter((document) => document.id !== selectedDocument.id);
      setSelectedId(next[0]?.id || '');
      return next;
    });
  };

  const handleReset = () => {
    const initial = buildInitialDocuments(lang);
    setDocuments(initial);
    setSelectedId(initial[0]?.id || '');
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(storageKey);
    }
  };

  return (
    <div className='px-4 py-8 sm:px-6 md:px-12 lg:px-16 xl:px-24'>
      <div className='mb-8 flex flex-col gap-4 rounded-3xl bg-linear-to-r from-dark-yellow via-cyan to-dark-cyan px-6 py-8 text-white shadow-lg sm:px-8 sm:py-10'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div>
            <p className='text-sm uppercase tracking-[0.2em] text-white/70'>{lang === 'en' ? 'Admin workspace' : 'Админская зона'}</p>
            <h1 className='mt-2 text-3xl font-extrabold sm:text-4xl'>{t.title}</h1>
          </div>
          <Link href={`/${lang}/student/documents`} className='inline-flex items-center gap-2 rounded-2xl border border-white/40 px-4 py-3 text-sm font-semibold transition-colors hover:bg-white/10'>
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

      <div className='mb-8 grid grid-cols-1 gap-4 lg:grid-cols-4'>
        {categoryCards.map((category) => (
          <div key={category.key} className='rounded-2xl border border-gray/10 bg-light-gray/40 p-5 dark:border-medium-blue-gray/30 dark:bg-dark-gray'>
            <p className='text-sm text-medium-blue-gray dark:text-gray'>{t.categorySummary}</p>
            <p className='mt-2 text-xl font-bold text-dark-gray dark:text-white'>{category.title}</p>
            <p className='mt-1 text-sm text-medium-blue-gray dark:text-gray'>{category.count} {lang === 'en' ? 'documents' : 'документов'}</p>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 gap-6 xl:grid-cols-[380px_1fr]'>
        <section className='rounded-3xl border border-gray/10 bg-white p-5 shadow-sm dark:border-medium-blue-gray/30 dark:bg-surface'>
          <div className='mb-4 flex items-center justify-between gap-3'>
            <h2 className='text-2xl font-bold text-dark-gray dark:text-white'>{t.documentList}</h2>
            <Button onClick={handleAddDocument} className='bg-dark-cyan text-white hover:bg-cyan'>
              <MaterialIcon name='add' className='text-base' />
              {t.addDocument}
            </Button>
          </div>

          <div className='flex flex-col gap-3'>
            {documents.map((document) => {
              const isActive = document.id === selectedId;
              return (
                <button
                  key={document.id}
                  type='button'
                  onClick={() => setSelectedId(document.id)}
                  className={`rounded-2xl border p-4 text-left transition-colors ${isActive ? 'border-dark-yellow bg-dark-yellow/5' : 'border-gray/10 bg-light-gray/30 hover:border-dark-yellow/40 dark:border-medium-blue-gray/30 dark:bg-dark-gray'}`}
                >
                  <div className='flex items-start justify-between gap-3'>
                    <div>
                      <p className='text-xs uppercase tracking-[0.18em] text-medium-blue-gray dark:text-gray'>{t.categories[document.category as keyof typeof t.categories] || document.category}</p>
                      <h3 className='mt-1 text-lg font-semibold text-dark-gray dark:text-white'>{document.title}</h3>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${document.status === 'published' ? 'bg-light-green/20 text-dark-cyan' : 'bg-dark-yellow/15 text-dark-yellow'}`}>
                      {t.statuses[document.status]}
                    </span>
                  </div>
                  <p className='mt-3 text-sm text-medium-blue-gray dark:text-gray'>{document.description}</p>
                  <p className='mt-3 text-xs text-medium-blue-gray dark:text-gray'>{document.updatedAt}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className='rounded-3xl border border-gray/10 bg-white p-5 shadow-sm dark:border-medium-blue-gray/30 dark:bg-surface'>
          <div className='mb-5 flex flex-wrap items-center justify-between gap-3'>
            <div>
              <h2 className='text-2xl font-bold text-dark-gray dark:text-white'>{t.editor}</h2>
              <p className='text-sm text-medium-blue-gray dark:text-gray'>{lang === 'en' ? 'Prepare the document card for later server integration.' : 'Подготовьте карточку документа к последующему подключению сервера.'}</p>
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

          {selectedDocument ? (
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              <InputField
                value={selectedDocument.title}
                onChange={(event) => updateSelected('title', event.target.value)}
                placeholder={t.form.title}
                containerClassName='w-full'
                disableDarkTheme
              />
              <InputField
                value={selectedDocument.category}
                onChange={(event) => updateSelected('category', event.target.value)}
                placeholder={t.form.sectionPlaceholder}
                containerClassName='w-full'
                disableDarkTheme
              />
              <InputField
                value={selectedDocument.fileType}
                onChange={(event) => updateSelected('fileType', event.target.value)}
                placeholder={t.form.filePlaceholder}
                containerClassName='w-full'
                disableDarkTheme
              />
              <InputField
                value={selectedDocument.actionLabel}
                onChange={(event) => updateSelected('actionLabel', event.target.value)}
                placeholder={t.form.actionLabel}
                containerClassName='w-full'
                disableDarkTheme
              />
              <div className='lg:col-span-2'>
                <InputField
                  value={selectedDocument.description}
                  onChange={(event) => updateSelected('description', event.target.value)}
                  placeholder={t.form.description}
                  containerClassName='w-full'
                  disableDarkTheme
                />
              </div>
              <div className='lg:col-span-2'>
                <InputField
                  value={selectedDocument.purpose}
                  onChange={(event) => updateSelected('purpose', event.target.value)}
                  placeholder={t.form.purpose}
                  containerClassName='w-full'
                  disableDarkTheme
                />
              </div>
              <div className='lg:col-span-2'>
                <InputField
                  value={selectedDocument.source}
                  onChange={(event) => updateSelected('source', event.target.value)}
                  placeholder={t.form.sourcePlaceholder}
                  containerClassName='w-full'
                  disableDarkTheme
                />
              </div>
              <div className='lg:col-span-2'>
                <InputField
                  value={selectedDocument.preview}
                  onChange={(event) => updateSelected('preview', event.target.value)}
                  placeholder={t.form.previewPlaceholder}
                  containerClassName='w-full'
                  disableDarkTheme
                />
              </div>
              <div className='lg:col-span-2 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray/10 bg-light-gray/30 px-4 py-3 dark:border-medium-blue-gray/30 dark:bg-dark-gray'>
                <div>
                  <p className='text-sm text-medium-blue-gray dark:text-gray'>{lang === 'en' ? 'Last updated' : 'Последнее обновление'}</p>
                  <p className='text-base font-semibold text-dark-gray dark:text-white'>{selectedDocument.updatedAt}</p>
                </div>
                <Button onClick={() => setDocuments((current) => current.map((document) => document.id === selectedDocument.id ? { ...document, updatedAt: new Date().toISOString().slice(0, 10) } : document))} className='bg-dark-cyan text-white hover:bg-cyan'>
                  <MaterialIcon name='save' className='text-base' />
                  {t.save}
                </Button>
              </div>
            </div>
          ) : (
            <div className='rounded-2xl border border-dashed border-gray/20 p-8 text-center text-medium-blue-gray dark:border-medium-blue-gray/30 dark:text-gray'>
              {lang === 'en' ? 'No document selected yet.' : 'Пока не выбран документ.'}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}