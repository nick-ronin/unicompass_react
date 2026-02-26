export default function InputFieldWithIcon() { 
    return (
            <div className="relative text-black">
                <input type="text" name="name" placeholder="Placeholder" className="pl-10 pr-4 py-2 rounded-2xl bg-light-blue-gray"/>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="icon">search</span>
                </div>
            </div>
    );
}