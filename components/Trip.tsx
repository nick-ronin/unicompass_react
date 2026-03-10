interface TripProps {
    from: string;
    to: string;
    date: string;
}

export default function Trip({ from, to, date }: TripProps) {
    return (
        <div className='bg-light-blue-gray rounded-2xl p-6 w-full justify-between flex flex-row items-center dark:bg-surface dark:text-white'>
            <p className='text-lg'>{from} - {to}</p>
            <p className='text-lg'>{date}</p>
        </div>
    );
}