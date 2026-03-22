import InputField from "@/components/Input Field";
import Button from '@/components/Button';
import Link from 'next/link';
import KnowledgeBaseCard from '@/components/Knowledge Base Card';
import FAQItem from '@/components/FAQ item';

const translations = {
  ru: {
    needHelp: 'Нужна помощь?',
    searchPlaceholder: 'С чем нужна помощь?',
    search: 'Поиск',
    sections: 'Разделы',
    study: 'Учеба',
    events: 'События',
    dormitory: 'Общежитие',
    documents: 'Документы',
    contacts: 'Контакты',
    mySfu: 'Мой СФУ',
    ecourses: 'Электронные курсы',
    frequently: 'Часто ищут',
    faq: 'FAQ',
    question: 'Как перевестись на бюджет?',
    answer: 'Процедура и условия перевода на бюджетное обучение',
    faqQuestion: 'Как подать заявку на обмен?',
    faqAnswer: 'Перейдите в раздел «Профиль» и нажмите «Отправить заявку».',
    stillQuestions: 'Остались вопросы?',
    askStaff: 'Задать вопрос сотрудникам ЦИИВР',
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
    mySfu: 'My Siberian Federal University',
    ecourses: 'E-courses',
    frequently: 'Frequently searched',
    faq: 'FAQ',
    question: 'How to transfer to a state-funded place?',
    answer: 'Procedure and conditions for transfer to state-funded study',
    faqQuestion: 'How to apply for an exchange program?',
    faqAnswer: 'Go to “Profile” and click “Submit application”.',
    stillQuestions: 'Still have questions?',
    askStaff: 'Ask the CAIVR staff',
  },
};

export default function KnowledgeBasePage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const t = translations[lang as keyof typeof translations] || translations.ru;
  const base = `/${lang}/student`;

  return (
    <div className='pb-8'>
      <div className='bg-cyan dark:bg-dark-cyan flex flex-col items-center justify-center px-60 py-32 gap-8'>
        <p className='text-white text-5xl'>{t.needHelp}</p>
        <div className='flex flex-row gap-4'>
          <InputField icon={<span className='material-symbols-outlined'>search</span>} placeholder={t.searchPlaceholder} className='text-xl w-96 focus:bg-white'/>
          <Button className='bg-white text-cyan hover:bg-cyan hover:text-white border-2 flex items-center px-6 py-3 rounded-2xl cursor-pointer text-xl dark:bg-white dark:text-cyan dark:hover:bg-cyan dark:hover:text-white'>{t.search}</Button>
        </div>
      </div>
      <div className='px-32 py-8 flex flex-row gap-12'>
        <div className='flex flex-col gap-12'>
          <p className='font-extrabold text-3xl text-dark-gray dark:text-white'>{t.sections}</p>
          <div className='flex flex-col gap-6 text-xl text-gray dark:text-medium-blue-gray'>
            <Link href={`${base}/knowledge-base/education`} className='hover:underline'>{t.study}</Link>
            <Link href={`${base}/knowledge-base/events`} className='hover:underline'>{t.events}</Link>
            <Link href={`${base}/knowledge-base/dormitory`} className='hover:underline'>{t.dormitory}</Link>
            <Link href={`${base}/knowledge-base/documents`} className='hover:underline'>{t.documents}</Link>
            <Link href={`${base}/knowledge-base/contacts`} className='hover:underline'>{t.contacts}</Link>
            <Link href='https://i.sfu-kras.ru/' className='hover:underline'>{t.mySfu}</Link>
            <Link href='https://e.sfu-kras.ru/' className='hover:underline'>{t.ecourses}</Link>
          </div>
        </div>
        <div className='flex flex-col gap-10'>
          <p className='font-extrabold text-3xl text-dark-gray dark:text-white'>{t.frequently}</p>
          <div className='flex flex-col gap-6'>
            <div className='flex flex-row gap-8'>
              <KnowledgeBaseCard icon={<span className='material-symbols-outlined'>search</span>} title={t.question} description={t.answer} />
              <KnowledgeBaseCard icon={<span className='material-symbols-outlined'>search</span>} title={t.question} description={t.answer} />
              <KnowledgeBaseCard icon={<span className='material-symbols-outlined'>search</span>} title={t.question} description={t.answer} />
              <KnowledgeBaseCard icon={<span className='material-symbols-outlined'>search</span>} title={t.question} description={t.answer} />
            </div>
            <div className='flex flex-row gap-8'>
              <KnowledgeBaseCard icon={<span className='material-symbols-outlined'>search</span>} title={t.question} description={t.answer} />
              <KnowledgeBaseCard icon={<span className='material-symbols-outlined'>search</span>} title={t.question} description={t.answer} />
              <KnowledgeBaseCard icon={<span className='material-symbols-outlined'>search</span>} title={t.question} description={t.answer} />
              <KnowledgeBaseCard icon={<span className='material-symbols-outlined'>search</span>} title={t.question} description={t.answer} />
            </div>
          </div>
          <div className='flex flex-col gap-6'>
            <p className='font-extrabold text-3xl text-dark-gray dark:text-white'>{t.faq}</p>
            <div className='flex flex-col gap-3'>
              <FAQItem question={t.faqQuestion} answer={t.faqAnswer} />
              <FAQItem question={t.faqQuestion} answer={t.faqAnswer} />
              <FAQItem question={t.faqQuestion} answer={t.faqAnswer} />
              <FAQItem question={t.faqQuestion} answer={t.faqAnswer} />
            </div>
          </div>
          </div>
        </div>
        {/* CTA */}
        <div className='bg-cover bg-center bg-no-repeat px-74 py-48 flex flex-col items-start justify-center gap-6' style={{ backgroundImage: "url('/Questions Left.svg')" }}>
          <p className='text-white text-5xl'>{t.stillQuestions}</p>
          <Button className='group bg-white text-dark-yellow pr-6 pl-4 py-4 text-2xl font-medium transition-all duration-300 hover:gap-3 dark:bg-white dark:text-dark-yellow'>
            <span className='material-symbols-outlined inline-flex items-center max-w-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:max-w-8 group-hover:opacity-100'>arrow_forward</span>
            {t.askStaff}
          </Button>
        </div>
      </div>
  );
}
