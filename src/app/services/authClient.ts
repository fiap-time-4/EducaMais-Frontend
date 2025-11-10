import { createAuthClient } from "better-auth/react"

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: baseURL,
    plugins: [
      
    ]
})

export interface sessionUser {
    id: string;
    email: string;
    name: string;
}

