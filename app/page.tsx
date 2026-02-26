import Image from "next/image";
import InputFieldWithIcon from "@/components/Input Field With Icon";
import InputField from "@/components/Input Field";
import Button from "@/components/Button";

export default function Home() {
  return (
    <div>
      <InputFieldWithIcon></InputFieldWithIcon>
      <InputField></InputField>
      <Button className='bg-cyan text-white hover:bg-dark-cyan'>This is a button</Button>
    </div>
  );
}
