import {atom} from "jotai";
import type { AccountInterface } from "./components/util/Connect";

// Jotai implementation
export const accountAtom = atom<AccountInterface | null>(null);
  
export const  updateAccountAtom = atom(
    ()=> "",
    (get, set, account: AccountInterface | null) => {
        set(accountAtom, account);
    }
)