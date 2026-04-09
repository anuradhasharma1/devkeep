"use client"
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-[#f5f1eb] via-[#e8dfd5] to-[#d6c3b3] text-[#3e2f25]">

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between px-10 md:px-20 mt-20">

          {/* Left */}
          <div className="max-w-lg">

            <motion.h1
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold mb-4"
            >
              DevKeep
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl mb-4 text-[#6b4f3a]"
            >
              Your Cozy Code Vault ☕
            </motion.h2>

            <p className="text-sm text-[#5c4435] mb-6">
              Save, organize and access your snippets with a calm,
              distraction-free experience built for developers.
            </p>

            <div className="flex gap-4">
              <Link
                href="/dashboard"
                className="px-5 py-2 rounded-lg bg-[#3e2f25] text-white hover:scale-105 transition"
              >
                Try Now
              </Link>

              <Link
                href="/create"
                className="px-5 py-2 rounded-lg border border-[#8b6f5a] hover:bg-white/50 transition"
              >
                Create
              </Link>
            </div>
          </div>

          {/* Right Circle Design */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.6, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mt-10 md:mt-0 w-72 h-72 rounded-full bg-linear-to-tr from-[#d6c3b3] to-[#8b6f5a] blur-2xl"
          />
        </div>
      </div>
    </>
  );
}
