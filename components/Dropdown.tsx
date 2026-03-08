

interface DropdownProps {
    label?: string;
    options: string[];
    onSelect: (option: string) => void;
}

export default function Dropdown({ label, options, onSelect }: DropdownProps) {
    return (
        <div className='flex flex-col gap-2'>
            <p>{label}</p>
            <select onChange={(e) => onSelect(e.target.value)}>
                <option value="">Select an option</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}