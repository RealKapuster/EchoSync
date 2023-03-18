import {atom} from "jotai";
import type { AuthState } from "@polybase/auth"

// Jotai implementation
export const accountAtom = atom<AuthState | null>(null);

export const  updateAccountAtom = atom(
    ()=> "",
    (get, set, account: AuthState | null) => {
        set(accountAtom, account);
    }
)