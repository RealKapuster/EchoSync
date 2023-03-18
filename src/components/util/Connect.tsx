import { useState } from 'react';
import { Button } from 'antd';
import  {auth} from '~/helper';
import {useAtom} from "jotai";
import { accountAtom, updateAccountAtom } from '~/store';

import type { AuthState } from "@polybase/auth";

const Connect = () => {
    const [account] = useAtom(accountAtom);
    const [ ,updateAccount] = useAtom(updateAccountAtom);
    // const [account, setAccount] = useState<AuthState | null>(null);

    const signIn = async () => {
        if(auth == null) return;

        try{
            const authState = await auth.signIn();
            updateAccount(authState);
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
        {account ? 
            <Button type="primary" className="bg-green" onClick={()=> signOut()}>Disconnect Wallet</Button>
            :
            <Button type="primary" className="bg-green" onClick={()=> signIn()}>Connect Wallet</Button>
        }
    </div>
    )
}

export default Connect