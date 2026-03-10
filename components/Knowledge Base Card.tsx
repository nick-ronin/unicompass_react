
interface KnowledgeBaseCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export default function KnowledgeBaseCard({ icon, title, description }: KnowledgeBaseCardProps) {
    return (
        <div className='px-8 py-8 flex flex-col items-center justify-center gap-4 drop-shadow-lg rounded-2xl bg-white cursor-pointer hover:bg-cyan hover:text-white hover:scale-101 hover:-translate-y-1 hover:translate-x-1 duration-400 dark:bg-surface-secondary dark:text-white'>
            {icon}
            <h3 className='max-w-3xs text-2xl'>{title}</h3>
            <p className='max-w-3xs text-lg'>{description}</p>
        </div>
    );
}