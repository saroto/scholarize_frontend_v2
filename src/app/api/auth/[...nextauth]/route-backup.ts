import { AuthOptions, UserDepartment } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent", // this prompts the user to consent
          access_type: "offline", // this ensures that a refresh token is provided
          response_type: "code", // this ensures that the response is a code
          scope: "openid profile email", // this requests the user's profile
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    // Set the session expiration time (in seconds)
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
  },
  pages: {
    signIn: "/auth/signin",
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
          const responseBody = await response.text();
          console.error("Response body:", responseBody);
          return false;
        }
        // Parse the JSON response

        //TODO: get role from backend
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
        // console.log("Account", account);
      } catch {
        console.error("Error during signIn callback", Error);
        return false;
      }

      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        // Assign the temporary data from account to the token
        token.role = account.role;
        token.role_permissions = account.role_permissions;
        token.token = account.token; // Verify this assignment is correct for your use case
        token.department = account.department;
      }
      // console.log("Token", token);
      // console.log("account", account);
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as any; // Accessing the role from the token
        session.user.role_permissions = token.role_permissions as []; // Accessing role_permissions from the token
        session.user.token = token.token as string; // Accessing the token from the token
        session.user.department = token.department as UserDepartment; // Accessing the department from the token and casting it to the Department type
        console.log("Session", session);
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
