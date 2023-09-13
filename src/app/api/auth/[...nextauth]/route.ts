import { mergeAnonymousCartInUserCart } from "@/lib/db/cart";
import { prisma } from "@/lib/db/prisma-client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma as PrismaClient) as Adapter,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        session({ session, user }) {
            session.user.id = user.id;
            return session;
        }
    },
    events: {
        async signIn({ user }) {
            await mergeAnonymousCartInUserCart(user.id);
        },
    }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };