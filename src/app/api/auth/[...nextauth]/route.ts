import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    // セッションにユーザー情報を追加
    async session({ session, user, token }) {
      if (session.user) {
        session.user.id = token.sub || user.id; // tokenのsubまたはuserのidを使用
      }
      return session;
    },
    // JWTトークンにユーザー情報を追加
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  // ログインページの設定
  pages: {
    signIn: "/auth/signin",
    // 必要に応じて他のページもカスタマイズ可能
    // signOut: "/auth/signout",
    // error: "/auth/error",
  },
  // セッション設定
  session: {
    strategy: "jwt", // JWTベースのセッション
  },
  // シークレットキー
  secret: process.env.NEXTAUTH_SECRET, 
};

// App Router（app/）用のハンドラ関数
const handler = NextAuth(authOptions);

// 各HTTPメソッドをエクスポート
export { handler as GET, handler as POST };
