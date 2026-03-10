import InputField from "@/components/Input Field";
import Button from '@/components/Button';
import Link from 'next/link';
import KnowledgeBaseCard from '@/components/Knowledge Base Card';
import FAQItem from '@/components/FAQ item';

interface KnowledgeBasePageProps {
  params: Promise<{ lang: string }>;
}

export default async function KnowledgeBasePage({ params }: KnowledgeBasePageProps) {
  const { lang } = await params;
  const base = `/${lang}/student`;

  return (
    <div className='pb-8'>
      <div className='bg-cyan flex flex-col items-center justify-center px-60 py-32 gap-8'>
        <p className='text-white text-5xl'>Нужна помощь?</p>
        <div className='flex flex-row gap-4'>
          <InputField icon={<span className='icon'>search</span>} placeholder='С чем нужна помощь?' className='text-xl w-96 focus:bg-white'/>
          <Button className='bg-white text-cyan hover:bg-cyan hover:text-white border-2 flex items-center px-6 py-3 rounded-2xl cursor-pointer text-xl'>Найти</Button>
        </div>
      </div>
      <div className='px-32 py-8 flex flex-row gap-12'>
        <div className='flex flex-col gap-12'>
          <p className='font-extrabold text-3xl'>Разделы</p>
          <div className='flex flex-col gap-6 text-xl text-gray'>
            <Link href={`${base}/knowledge-base/education`} className='hover:underline'>Обучение</Link>
            <Link href={`${base}/knowledge-base/events`} className='hover:underline'>Мероприятия</Link>
            <Link href={`${base}/knowledge-base/dormitory`} className='hover:underline'>Общежитие</Link>
            <Link href={`${base}/knowledge-base/documents`} className='hover:underline'>Документы</Link>
            <Link href={`${base}/knowledge-base/contacts`} className='hover:underline'>Контакты</Link>
            <Link href='https://i.sfu-kras.ru/' className='hover:underline'>Мой СФУ</Link>
            <Link href='https://e.sfu-kras.ru/' className='hover:underline'>Е-курсы</Link>
          </div>
        </div>
        <div className='flex flex-col gap-10'>
          <p className='font-extrabold text-3xl'>Часто ищут</p>
          <div className='flex flex-col gap-6'>
            <div className='flex flex-row gap-8'>
              <KnowledgeBaseCard icon={<span className='icon icon-40'>search</span>} title='Как перевестись на бюджет?' description='Порядок и условия перевода на бюджетное обучение' />
              <KnowledgeBaseCard icon={<span className='icon icon-40'>search</span>} title='Как перевестись на бюджет?' description='Порядок и условия перевода на бюджетное обучение' />
              <KnowledgeBaseCard icon={<span className='icon icon-40'>search</span>} title='Как перевестись на бюджет?' description='Порядок и условия перевода на бюджетное обучение' />
              <KnowledgeBaseCard icon={<span className='icon icon-40'>search</span>} title='Как перевестись на бюджет?' description='Порядок и условия перевода на бюджетное обучение' />
            </div>
            <div className='flex flex-row gap-8'>
              <KnowledgeBaseCard icon={<span className='icon icon-40'>search</span>} title='Как перевестись на бюджет?' description='Порядок и условия перевода на бюджетное обучение' />
              <KnowledgeBaseCard icon={<span className='icon icon-40'>search</span>} title='Как перевестись на бюджет?' description='Порядок и условия перевода на бюджетное обучение' />
              <KnowledgeBaseCard icon={<span className='icon icon-40'>search</span>} title='Как перевестись на бюджет?' description='Порядок и условия перевода на бюджетное обучение' />
              <KnowledgeBaseCard icon={<span className='icon icon-40'>search</span>} title='Как перевестись на бюджет?' description='Порядок и условия перевода на бюджетное обучение' />
            </div>
          </div>
          <div className='flex flex-col gap-6'>
            <p className='font-extrabold text-3xl'>FAQ</p>
            <div className='flex flex-col gap-3'>
              <FAQItem question='Как подать заявку на обмен?' answer='Для подачи заявки перейдите в раздел «Профиль» и нажмите кнопку «Подать заявку».' />
              <FAQItem question='Как подать заявку на обмен?' answer='Для подачи заявки перейдите в раздел «Профиль» и нажмите кнопку «Подать заявку».' />
              <FAQItem question='Как подать заявку на обмен?' answer='Для подачи заявки перейдите в раздел «Профиль» и нажмите кнопку «Подать заявку».' />
              <FAQItem question='Как подать заявку на обмен?' answer='Для подачи заявки перейдите в раздел «Профиль» и нажмите кнопку «Подать заявку».' />
            </div>
          </div>
          </div>
        </div>
        {/* CTA */}
        <div className='bg-cover bg-center bg-no-repeat px-74 py-48 flex flex-col items-start justify-center gap-6' style={{ backgroundImage: "url('/Questions Left.svg')" }}>
          <p className='text-white text-5xl'>Остались вопросы?</p>
          <Button className='group bg-white text-dark-yellow pr-6 pl-4 py-4 text-2xl font-medium transition-all duration-300 hover:gap-3'>
            <span className='icon inline-flex items-center max-w-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:max-w-8 group-hover:opacity-100'>arrow_forward</span>
            Спросить сотрудника ЦАИВР
          </Button>
        </div>
      </div>
  );
}
