interface TripProps {
    location: string;
    arrivalDate: string;
    departureDate: string;
    onEdit?: () => void;
    onDelete?: () => void;
}

const formatDate = (value: string) => {
    const parsed = value ? new Date(value) : null;
    if (!parsed || Number.isNaN(parsed.getTime())) return value || '';
    return parsed.toLocaleDateString();
};

export default function Trip({ location, arrivalDate, departureDate, onEdit, onDelete }: TripProps) {
    return (
        <div className='bg-light-blue-gray rounded-2xl p-6 w-full flex flex-row items-center justify-between dark:bg-surface dark:text-white'>
            <div className='flex flex-col gap-1'>
                <p className='text-lg font-semibold text-dark-gray dark:text-white'>{location}</p>
                <p className='text-sm text-gray-700 dark:text-gray-300'>
                    {formatDate(arrivalDate)} — {formatDate(departureDate)}
                </p>
            </div>
            {(onEdit || onDelete) && (
                <div className='flex items-center gap-2'>
                    {onEdit && (
                        <button
                            type='button'
                            onClick={onEdit}
                            className='p-2 rounded-xl bg-medium-blue-gray text-white hover:bg-dark-gray transition-colors dark:bg-medium-blue-gray dark:hover:bg-dark-gray cursor-pointer'
                            aria-label='Edit trip'
                        >
                            <span className='material-symbols-outlined text-lg'>edit</span>
                        </button>
                    )}
                    {onDelete && (
                        <button
                            type='button'
                            onClick={onDelete}
                            className='p-2 rounded-xl bg-orange text-white hover:bg-dark-orange transition-colors cursor-pointer'
                            aria-label='Delete trip'
                        >
                            <span className='material-symbols-outlined text-lg'>delete</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}