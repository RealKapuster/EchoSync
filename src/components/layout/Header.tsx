import Image from "next/image";
import Connect from "../ui/Connect";

const Header = () => {
    return (
        <header className="bg-white p-[10px] shadow">
            <div className='container flex justify-between items-center'>
            <Image
                src="/ui/parrot.svg"
                alt="logo"
                width={50}
                height={50}
                />
                <nav>

                </nav>
                <Connect></Connect>
            </div>
        </header>
    )
}

export default Header