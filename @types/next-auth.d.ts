import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string,
            username: string | null,
            bio: string | null,
        } & DefaultSession["user"]
    }
}