import { Auth } from '@polybase/auth'

// Polybase auth instance
export const auth = typeof window !== "undefined" ? new Auth() : null;