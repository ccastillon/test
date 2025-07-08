import config from "@/utils/config";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserSession } from "user-module";

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Your email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        const response = await fetch(`${config.baseApiUrl}/Auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const user = await response.json();

        if (!response.ok) throw user;

        if (user) {
          return user;
        } else {
          return null;
        }

        // const user = {
        //   id: "9001",
        //   name: "Web Admin",
        //   email: "admin@example.com",
        // };
        // return user;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user as UserSession;
        return { ...token, ...user };
      }

      const accessTokenExpiry = token.user.accessTokenExpiry.toString();
      const utcCurrentDateTime = new Date().toISOString();

      // If accessTokenExpiry is 1 hour, refresh accessToken 30 minutes before expiry
      const shouldRefreshTime = Math.round(Date.parse(accessTokenExpiry) - 30 * 60 * 1000 - Date.parse(utcCurrentDateTime));

      // console.log("JWT CALLBACK shouldRefreshTime: ", shouldRefreshTime);

      if (shouldRefreshTime > 0) {
        // If the access token has not expired yet, return it
        return token;
      } else {
        // If the access token has expired, try to refresh it
        try {
          const refreshModel = {
            accessToken: token.user.accessToken,
            refreshToken: token.user.refreshToken,
          };

          const response = await fetch(`${config.baseApiUrl}/auth/refresh`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(refreshModel),
          });
          const newToken = await response.json();

          if (!response.ok) throw newToken;

          token.user = newToken;

          return token;
        } catch (error) {
          console.error("Error refreshing access token", error);

          return { ...token, error: "RefreshAccessTokenError" };
        }
      }
    },

    async session({ token, session }) {
      session.user = token.user;
      session.user.error = token.error as any;

      return session;
    },
  },
};
