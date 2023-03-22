import {atom} from "jotai";
import type { AccountInterface } from "./components/ui/Connect";

// Jotai implementation
export const accountAtom = atom<AccountInterface | null>(null);
export const transcriptAtom = atom<string | null>(null);
  
export const  updateAccountAtom = atom(
    ()=> "",
    (get, set, account: AccountInterface | null) => {
        set(accountAtom, account);
    }
)

export const  updateTranscriptAtom = atom(
    ()=> "",
    (get, set, text: string | null) => {
        set(transcriptAtom, text);
    }
)