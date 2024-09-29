/** @format */

import { AuthOptions, UserDepartment } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid profile email",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      const formData = new FormData();
      formData.append("name", user.name as string);
      formData.append("email", user.email as string);
      formData.append("profile_url", user.image as string);
      formData.append("access_token", account?.access_token as string);
      try {
        const response = await fetch(process.env.API_URL + "/login", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          console.error("Failed to validate user with backend");
          console.error("Status code:", response.status);
          const responseBody = await response.json();

          if (responseBody.error.startsWith("Email is not authorized")) {
            console.error(responseBody.error);
            // TODO: Redirect to unauthorized page
            return false;
          }
          return false;
        }

        if (account) {
          try {
            const data = await response.json();
            account.role = data.role;
            account.role_permissions = data.role_permissions;
            account.token = data.token;
            account.department = data.department;
          } catch {
            console.error("Error during signIn callback", Error);
            return false;
          }
        }
      } catch {
        console.error("Error during signIn callback", Error);
        return false;
      }

      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.role = account.role;
        token.role_permissions = account.role_permissions;
        token.token = account.token;
        token.department = account.department;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as any;
        session.user.role_permissions = token.role_permissions as [];
        session.user.token = token.token as string;
        session.user.department = token.department as UserDepartment;
      }

      return session;
    },
  },
};
