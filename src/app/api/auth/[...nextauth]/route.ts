// src/app/api/auth/[...nextauth]/route.ts
import { authOptions } from "@/lib/authOptions"; // こっちから読み込む
import NextAuth from "next-auth/next";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };