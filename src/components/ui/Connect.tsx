import { Button } from 'antd';
// Polybase Dependency
import  {auth} from '~/helper';
// Intmax Dependency
import { IntmaxWalletSigner } from "webmax";
import Image from 'next/image';

import {useAtom} from "jotai";
import { accountAtom, updateAccountAtom } from '~/store';

// Interfaces
export interface AccountInterface {
    publicKey?: string | null;
    chainId?: number; 
}

const Connect = () => {

    const [account] = useAtom(accountAtom);
    const [ ,updateAccount] = useAtom(updateAccountAtom);

    const signInPolybase = async () => {
        if(auth == null) return;

        try{
            const authState = await auth.signIn();
            const accoundData = {publicKey: authState?.userId ?? null}
            updateAccount(accoundData);
        }catch(err){
            console.log(err);
        }
    }
    
    const signInIntmax = async () => {
        try{
            const signer = new IntmaxWalletSigner();
            const account = await signer.connectToAccount();
            const accoundData = {publicKey: account?.address ?? null, chainId: account?.chainId }
            updateAccount(accoundData);
        }catch(err){
            console.log(err);
        }
    }

    const signOut = async () => {
        if(auth == null) return;

        try{
            await auth.signOut();
            updateAccount(null);
        }catch(err){
            console.log(err);
        }
    }

    return (
    <div>
        {!account ? 
            <div className='flex'>
                <Button type="primary" className="mr-2 flex align-middle bg-btnColour rounded-full font-bold text-md py-[10px] px-6 h-auto
                    hover:!bg-transparent hover:!text-btnColour hover:!border-solid border-btnColour border-1" 
                    onClick={()=> signInPolybase()}>
                        <Image src={"/img/metamask-logo.svg"} height={20} width={20} alt="metamask logo" className='mr-2'></Image>
                        Metamask Login
                </Button>
                <Button type="primary" className="bg-btnColour flex align-middle rounded-full font-bold text-md py-[10px] px-6 h-auto
                    hover:!bg-transparent hover:!text-btnColour hover:!border-solid border-btnColour border-1" 
                    onClick={()=> signInIntmax()}>
                        <Image src={"/img/intmax-logo.png"} height={20} width={20} alt="intmax logo" className='mr-2'></Image>
                        Intmax Login
                </Button>
            </div>
            :
            <Button type="primary" className="bg-green bg-btnColour rounded-full font-bold text-md py-[10px] px-6 h-auto
                hover:!bg-transparent hover:!text-btnColour hover:!border-solid border-btnColour border-1" 
                onClick={()=> signOut()}>
                    Disconnect
            </Button>
        }
    </div>
    )
}

export default Connect