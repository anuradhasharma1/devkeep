"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggler";

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: "easeOut" },
});



export default function Navbar() {
    return (
        <motion.nav {...fadeUp(0.05)}
            className="relative z-10 flex items-center justify-between px-8 py-5"
            style={{ borderBottom: "1px solid var(--border)" }}>
            <Link href="/">
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700 }}>
                    Dev<span style={{ color: "var(--accent)" }}>Keep</span>
                </span>
            </Link>
            <div className="hidden md:flex gap-6 text-xs tracking-widest" style={{ color: "var(--accent)" }}>
                <Link href="#features">features</Link>
                <Link href="#how">How it works</Link>
                <Link href="#contact">contact</Link>
            </div>
            <div className=" flex items-center gap-2">
                <ThemeToggle />
                <Link href="/login"
                    className="text-xs px-4 py-1.5 rounded tracking-widest transition-all hover:opacity-80"
                    style={{ border: "1px solid var(--accent)", color: "var(--accent)", fontFamily: "inherit" }}>
                    sign in
                </Link>
            </div>

        </motion.nav>
    );
}