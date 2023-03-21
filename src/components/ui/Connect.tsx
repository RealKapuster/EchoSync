import { Button } from 'antd';
// Polybase Dependency
import  {auth} from '~/helper';
// Intmax Dependency
import { IntmaxWalletSigner } from "webmax";

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
                <Button type="primary" className="mr-2" onClick={()=> signInPolybase()}>Metamask Login</Button>
                <Button type="primary" className="" onClick={()=> signInIntmax()}>Intmax Login</Button>
            </div>
            :
            <Button type="primary" className="bg-green" onClick={()=> signOut()}>Disconnect</Button>
        }
    </div>
    )
}

export default Connect