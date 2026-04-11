import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/core/db";
import User from "@/models/user";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),


        //email & pass
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                await connectDB();

                const user = await User.findOne({ email: credentials.email.toLowerCase() }).select("+password");

                if (!user) throw new Error("No account found with this email");
                if (!user.password) throw new Error("This account uses Google sign-in. Please use Google.");

                const isMatch = await bcrypt.compare(credentials.password, user.password);
                if (!isMatch) throw new Error("Incorrect password");

                return { id: user._id.toString(), name: user.name, email: user.email };
            },
        }),
    ],

    callbacks: {
        // Called after sign-in — create Google users in DB if first time
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                await connectDB();
                const existing = await User.findOne({ email: user.email });
                if (!existing) {
                    await User.create({
                        name: user.name,
                        email: user.email,
                        password: null,           // Google users have no password
                        avatar: user.image,
                    });
                }
            }
            return true;
        },

        // Put user id into the JWT token
        async jwt({ token, user }) {
            // Credentials login: user.id is directly available
            if (user?.id) {
                token.userId = user.id;
                return token;
            }

            // Google login or token refresh: fetch from DB once
            if (!token.userId && token.email) {
                await connectDB();
                const dbUser = await User.findOne({ email: token.email });
                if (dbUser) token.userId = dbUser._id.toString();
            }

            return token;
        },

        // Put userId into session so frontend can use it
        async session({ session, token }) {
            if (token?.userId) session.user.id = token.userId;
            return session;
        },
    },

    pages: {
        signIn: "/login",
        error: "/login",
    },

    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
