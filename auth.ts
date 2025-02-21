import { PrismaAdapter } from "@auth/prisma-adapter";
import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextResponse } from "next/server";
import { prisma } from "./db/prisma";

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, //30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) return null;
        // find user in database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });
        // console.log(user?.email, user?.password);
        // check if user exists and if the password matches
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );
          // if password is correct return user
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        // if user doesnot match  return null
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user, trigger }: any) {
      //set the userId from the token
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;
      // console.log(token);

      //   if there is an update, set the username
      if (trigger == "update") {
        session.user.name = user.name;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }: any) {
      // assign user fields to token
      if (user) {
        token.role = user.role;
        // if user has no name use the email
        if (user.name === "NO_NAME") {
          token.name = user.email!.split("@")[0];
          // update database to reflect the token name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }
      }
      return token;
    },
    authorized({ request, auth }: any) {
      // check for  session cart cookies
      if (!request.cookies.get("sessionCartId")) {
        // generate new sessionId cookie
        const sessionCartId = crypto.randomUUID();
        // console.log(sessionCartId);
        // clone req headers
        const newRequestHeaders = new Headers(request.headers);
        // create the new response and new headers
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });

        // set newly generated sessionCartId in the respnse cookies
        response.cookies.set("sessionCartId", sessionCartId);
        return response;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;
export const { handlers, signIn, signOut, auth } = NextAuth(config);
