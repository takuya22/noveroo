import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * NextAuth.jsで使用するセッションの型を拡張
   */
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
