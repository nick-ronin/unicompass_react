import MaterialIcon from '@/components/MaterialIcon';

interface TripProps {
    departurePoint: string;
    destination: string;
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

export default function Trip({ departurePoint, destination, arrivalDate, departureDate, onEdit, onDelete }: TripProps) {
    return (
        <div className='flex w-full flex-col gap-3 rounded-2xl bg-light-blue-gray p-4 dark:bg-surface dark:text-white sm:flex-row sm:items-center sm:justify-between sm:p-6'>
            <div className='flex flex-col gap-1'>
                <p className='text-base font-semibold text-dark-gray dark:text-white sm:text-lg'>
                    {departurePoint} {'->'} {destination}
                </p>
                <p className='text-sm text-gray-700 dark:text-gray-300'>
                    {formatDate(arrivalDate)} — {formatDate(departureDate)}
                </p>
            </div>
            {(onEdit || onDelete) && (
                <div className='flex items-center gap-2 self-end sm:self-auto'>
                    {onEdit && (
                        <button
                            type='button'
                            onClick={onEdit}
                            className='cursor-pointer rounded-xl bg-medium-blue-gray p-2 text-white transition-colors hover:bg-dark-gray dark:bg-medium-blue-gray dark:hover:bg-dark-gray'
                            aria-label='Edit trip'
                        >
                            <MaterialIcon name='edit' className='text-lg' />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            type='button'
                            onClick={onDelete}
                            className='cursor-pointer rounded-xl bg-orange p-2 text-white transition-colors hover:bg-dark-orange'
                            aria-label='Delete trip'
                        >
                            <MaterialIcon name='delete' className='text-lg' />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}