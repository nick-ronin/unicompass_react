import Image from "next/image";

export default function Home() {
  return (
    <div className='px-32 pb-8'>
      <div className='flex flex-row gap-4 items-center mt-8'>
        <Image src='/NoAvatarDefault.svg' width={64} height={64} alt='Avatar'></Image>
        <div className='flex flex-col'>
          <p className='text-2xl font-extrabold'>Фишер Никита Антонович</p>
          <p>Курс: 1, ИКИТ, КИ26-14Б</p>
        </div>
      </div>
    </div>
  );
}
