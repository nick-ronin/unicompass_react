import Image from 'next/image';
import Button from '@/components/Button';
import InputField from '@/components/Input Field';
import Document from '@/components/Document';
import Trip from '@/components/Trip';

// TODO: replace with real data

const leftFields = [
  "Адрес проживания",
  "Гражданство",
  "Номер паспорта",
  "СНИЛС",
  "ИНН"
]

const rightFields = [
  "Дата рождения",
  "Электронная почта",
  "Электронная почта СФУ",
  "Номер телефона родной страны",
  "Номер телефона РФ"
]

export default function ProfilePage() {
  return (
    <div className='px-48 pb-8 gap-24 flex flex-col'>
      {/* Краткая информация */}
      <div className=''>
        <div className='flex flex-row gap-4 items-center mt-8'>
          <Image src='/NoAvatarDefault.svg' width={64} height={64} alt='Avatar'></Image>
          {/* Имя + учебная инфа */}
          <div className='flex flex-col'>
            <p className='text-2xl font-extrabold'>Фишер Никита Антонович</p>
            <p className='text-lg'>Курс: 1, ИКИТ, КИ26-14Б</p>
          </div>
        </div>
        {/* Поля для редактирования + кнопка редактировать */}
        <div className='flex flex-col'>
          <div className='flex justify-end'>
            <Button className='bg-orange text-white hover:bg-dark-orange text-lg' icon={<span className='icon icon-rounded'>edit</span>}>Редактировать</Button>
          </div>
          {/* Поля для редактирования */}
          <div className="grid grid-cols-2 gap-8">
            {/* Левая колонка */}
            <div className='flex flex-col gap-4'>
              {leftFields.map(label => (
                <div key={label}>
                  <p className="text-lg px-4">{label}</p>
                  <InputField placeholder={label} className="w-full text-lg"/>
                </div>
              ))}
            </div>
            {/* Правая колонка */}
            <div className='flex flex-col gap-4'>
              {rightFields.map(label => (
                <div key={label}>
                  <p className="text-lg px-4">{label}</p>
                  <InputField placeholder={label} className="w-full text-lg"/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Документы */}
      <div className='flex flex-col gap-8'>
        <p className='text-2xl font-extrabold'>Мои документы</p>
        <div className='grid grid-cols-4 col-span-4 gap-8 justify-center items-center'>
          <Document name='ИНН' image={<Image src='/img/doc1.png' width={240} height={340} alt='Document' className='object-fill'></Image>}></Document>
          <Document name='СНИЛС' image={<Image src='/img/doc3.png' width={240} height={340} alt='Document' className='object-fill'></Image>}></Document>
          <Document name='Паспорт' image={<Image src='/img/doc2.png' width={240} height={340} alt='Document' className='object-fill'></Image>}></Document>
          <Document name='Виза' image={<Image src='/img/doc5.png' width={240} height={340} alt='Document' className='object-fill'></Image>}></Document>
          <Document name='Аттестат' image={<Image src='/img/doc4.png' width={240} height={340} alt='Document' className='object-fill'></Image>}></Document>
          <Document name='Справка' image={<Image src='/img/doc6.jpg' width={240} height={340} alt='Document' className='object-fill'></Image>}></Document>
          <div className='flex items-center justify-center w-[264]'>
            <Button className='bg-cyan text-white hover:bg-dark-cyan px-4 py-4 rounded-full' icon={<span className='icon icon-rounded icon-48'>add</span>}></Button>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-8'>
        <div className='flex flex-row justify-between items-center'>
          <p className='text-2xl font-extrabold'>Мои поездки</p>
          <Button className='bg-cyan text-white hover:bg-dark-cyan text-lg' icon={<span className='icon icon-rounded'>add</span>}>Добавить поездку</Button>
        </div>
        <div className='flex flex-col gap-4'>
          <Trip from='Алматы' to='Красноярск' date='29.08.2026'></Trip>
          <Trip from='Москва' to='Санкт-Петербург' date='30.08.2026'></Trip>
          <Trip from='Казань' to='Нижний Новгород' date='31.08.2026'></Trip>
        </div>
      </div>
    </div>
  );
}
