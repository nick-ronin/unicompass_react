import Image from 'next/image';

interface UserChatCardProps {
    name: string;
    lastMessage: string;
}

export default function UserChatCard({ name, lastMessage }: UserChatCardProps) {
    return (
        <div className='flex flex-row'>
            <Image src='/NoAvatarDefault.svg' width={54} height={54} alt='Аватар'></Image>
            <div className='flex flex-col'>
                <p className='text-lg'>{name}</p>
                <p className='text-md'>{lastMessage}</p>
            </div>
        </div>
    );
}