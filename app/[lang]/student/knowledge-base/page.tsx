"use client";

import { useMemo, useState } from "react";
import { useParams } from 'next/navigation';
import InputField from "@/components/Input Field";
import Link from 'next/link';
import KnowledgeBaseCard from '@/components/Knowledge Base Card';
import FAQItem from '@/components/FAQ item';
import MaterialIcon from '@/components/MaterialIcon';

const translations = {
  ru: {
    needHelp: 'Нужна помощь?',
    searchPlaceholder: 'С чем нужна помощь?',
    search: 'Поиск',
    sections: 'Разделы',
    study: 'Учеба',
    events: 'Мероприятия',
    dormitory: 'Общежитие',
    documents: 'Документы',
    contacts: 'Контакты',
    mySibFU: 'Мой СФУ',
    eCourse: 'еКурсы',
    frequently: 'Часто ищут',
    faq: 'FAQ',
    frequentItems: [
      { title: 'Как перевестись на бюджет?', description: 'Процедура и условия перевода на бюджетное обучение', icon: 'swap_horiz' },
      { title: 'Оформление ВНЖ', description: 'Необходимые документы и сроки подачи', icon: 'description' },
      { title: 'Медицинская страховка', description: 'Где оформить полис и сколько это стоит', icon: 'health_and_safety' },
      { title: 'Общежитие и заселение', description: 'Правила заселения и список вещей', icon: 'home' },
      { title: 'Электронные курсы', description: 'Как получить доступ и записаться на курс', icon: 'cast_for_education' },
      { title: 'Академический отпуск', description: 'Как оформить академический отпуск и вернуться к учебе', icon: 'beach_access' },
      { title: 'Стипендии и выплаты', description: 'Виды стипендий, условия получения и сроки', icon: 'payments' },
      { title: 'Студенческий билет', description: 'Как восстановить утерянный билет', icon: 'badge' },
    ],
    faqItems: [
      { question: 'Как подать заявку на обмен?', answer: 'Перейдите в раздел «Профиль» и нажмите «Отправить заявку».' },
      { question: 'Как поменять учебную группу?', answer: 'Обратитесь в деканат или подайте запрос через личный кабинет.' },
      { question: 'Где посмотреть расписание экзаменов?', answer: 'Расписание публикуется в разделе «Учеба» и обновляется перед сессией.' },
      { question: 'Как получить академическую справку?', answer: 'Подайте запрос в разделе «Документы», готовность — до 5 рабочих дней.' },
    ],
    stillQuestions: 'Остались вопросы?',
    askStaff: 'Задать вопрос сотрудникам ЦАИВР',
    noResults: 'Ничего не найдено',
  },
  en: {
    needHelp: 'Need help?',
    searchPlaceholder: 'What do you need help with?',
    search: 'Search',
    sections: 'Sections',
    study: 'Study',
    events: 'Events',
    dormitory: 'Dormitory',
    documents: 'Documents',
    contacts: 'Contacts',
    mySibFU: 'MySibFU',
    eCourse: 'eCourses',
    frequently: 'Frequently searched',
    faq: 'FAQ',
    frequentItems: [
      { title: 'Transfer to state-funded track', description: 'Procedure and requirements for moving to a state-funded place', icon: 'swap_horiz' },
      { title: 'Residence permit paperwork', description: 'Required documents and submission deadlines', icon: 'description' },
      { title: 'Medical insurance', description: 'Where to get a policy and typical costs', icon: 'health_and_safety' },
      { title: 'Dormitory and move-in', description: 'Move-in rules, timelines, and what to bring', icon: 'home' },
      { title: 'E-courses access', description: 'How to enroll and access online courses', icon: 'cast_for_education' },
      { title: 'Academic leave', description: 'How to request leave and return to studies', icon: 'beach_access' },
      { title: 'Scholarships and stipends', description: 'Types, eligibility, and payout dates', icon: 'payments' },
      { title: 'Student ID card', description: 'Steps to restore a lost student card', icon: 'badge' },
    ],
    faqItems: [
      { question: 'How to apply for an exchange program?', answer: 'Go to “Profile” and click “Submit application”.' },
      { question: 'How to change my study group?', answer: 'Contact the dean’s office or submit a request via your account.' },
      { question: 'Where to see the exam schedule?', answer: 'It is published under “Study” and refreshed before each exam period.' },
      { question: 'How to request an academic transcript?', answer: 'Submit a request in “Documents”; processing takes up to 5 business days.' },
    ],
    stillQuestions: 'Still have questions?',
    askStaff: 'Ask the CAIVR staff',
    noResults: 'No results found',
  },
};

export default function KnowledgeBasePage() {
  const params = useParams();
  const lang = (params?.lang as string) || 'ru';
  const t = translations[lang as keyof typeof translations] || translations.ru;
  const base = `/${lang}/student`;
  const [query, setQuery] = useState('');

  const normalizedQuery = query.trim().toLowerCase();

  const sectionLinks = useMemo(() => ([
    { label: t.study, href: `${base}/knowledge-base/education` },
    { label: t.events, href: `${base}/knowledge-base/events` },
    { label: t.dormitory, href: `${base}/knowledge-base/dormitory` },
    { label: t.documents, href: `${base}/knowledge-base/documents` },
    { label: t.contacts, href: `${base}/knowledge-base/contacts` },
    { label: t.mySibFU, href: 'https://i.sfu-kras.ru/' },
    { label: t.eCourse, href: 'https://e.sfu-kras.ru/' },
  ]), [base, t.contacts, t.documents, t.dormitory, t.eCourse, t.events, t.mySibFU, t.study]);

  const filteredSections = useMemo(() => {
    if (!normalizedQuery) return sectionLinks;
    return sectionLinks.filter((section) =>
      section.label.toLowerCase().includes(normalizedQuery)
    );
  }, [normalizedQuery, sectionLinks]);

  const filteredFrequent = useMemo(() => {
    if (!normalizedQuery) return t.frequentItems;
    return t.frequentItems.filter((item) =>
      item.title.toLowerCase().includes(normalizedQuery) ||
      item.description.toLowerCase().includes(normalizedQuery)
    );
  }, [normalizedQuery, t.frequentItems]);

  return (
    <div className='pb-8'>
      <div className='flex flex-col justify-center items-center gap-6 bg-cyan px-4 py-12 dark:bg-dark-cyan sm:px-6 sm:py-16 lg:px-16 lg:py-24'>
        <p className='text-3xl text-white sm:text-4xl lg:text-5xl'>{t.needHelp}</p>
        <div className='flex flex-row gap-4'>
          <InputField
            icon={<MaterialIcon name='search' size='sm' />}
            placeholder={t.searchPlaceholder}
            className='w-full max-w-xl text-base focus:bg-white sm:text-lg'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <div className='flex flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:gap-12 lg:px-8'>
        <div className='flex flex-col gap-8 lg:min-w-60 lg:gap-12'>
          <p className='text-2xl font-extrabold text-dark-gray dark:text-white sm:text-3xl'>{t.sections}</p>
          <div className='flex flex-col gap-4 text-base text-gray dark:text-medium-blue-gray sm:gap-6 sm:text-xl'>
            {filteredSections.map((section) => (
              <Link key={section.href} href={section.href} className='hover:underline'>
                {section.label}
              </Link>
            ))}
            {filteredSections.length === 0 && (
              <span className='text-base text-medium-blue-gray dark:text-gray'>
                {t.noResults}
              </span>
            )}
          </div>
        </div>
        <div className='flex flex-1 flex-col gap-8 sm:gap-10'>
          <p className='text-2xl font-extrabold text-dark-gray dark:text-white sm:text-3xl'>{t.frequently}</p>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 sm:gap-6'>
            {filteredFrequent.map((item, idx) => (
              <KnowledgeBaseCard
                key={`${item.title}-${idx}`}
                icon={<MaterialIcon name={item.icon} />}
                title={item.title}
                description={item.description}
              />
            ))}
            {filteredFrequent.length === 0 && (
              <div className='col-span-full text-medium-blue-gray dark:text-gray text-lg'>
                {t.noResults}
              </div>
            )}
          </div>
          <div className='flex flex-col gap-6'>
            <p className='text-2xl font-extrabold text-dark-gray dark:text-white sm:text-3xl'>{t.faq}</p>
            <div className='flex flex-col gap-3'>
              {t.faqItems.map((item, idx) => (
                <FAQItem key={`${item.question}-${idx}`} question={item.question} answer={item.answer} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* CTA */}
      <div className='flex flex-col items-start justify-center gap-6 bg-cover bg-center bg-no-repeat px-4 py-12 sm:px-6 sm:py-16 lg:px-16 lg:py-24' style={{ backgroundImage: "url('/Questions Left.svg')" }}>
        <p className='text-3xl text-white sm:text-4xl lg:text-5xl'>{t.stillQuestions}</p>
        <Link href={`${base}/chat`} className='group flex flex-row items-center gap-4 rounded-2xl bg-white px-4 py-3 text-base font-medium text-dark-yellow transition-all duration-300 hover:gap-3 dark:bg-white dark:text-dark-yellow sm:px-6 sm:py-4 sm:text-2xl'>
          <MaterialIcon name='arrow_forward' className='inline-flex items-center max-w-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:max-w-8 group-hover:opacity-100' />
          {t.askStaff}
        </Link>
      </div>
    </div>
  );
}
