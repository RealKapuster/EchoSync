import { Button } from 'antd'
import Image from 'next/image';
import {useAtom} from "jotai";
import { accountAtom, transcriptAtom } from '~/store';

const LensBox = () => {
    const [account] = useAtom(accountAtom);

    // Signing in to Lens protocol on click
    const signInToLens = () => {
        console.log("signing in to Lens");
    }

    return (
        <div className="rounded-lg bg-white shadow-md w-full">
            <div className='p-6'>
                <h2 className="mt-0 font-normal">My Account</h2>
                <div className='flex flex-col'>
                    <Image className="" src="./img/profile.svg" alt="profile picture" height={100} width={100}></Image>
                    <p className='text-sm'>{account?.publicKey}</p>
                </div>
            </div>
        </div>
    )
}

export default LensBox