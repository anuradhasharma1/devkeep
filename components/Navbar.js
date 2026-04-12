"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggler";
import { useAuth } from "@/hooks/UseAuth";


const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: "easeOut" },
});

export default function Navbar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    if (pathname.startsWith("/dashboard")) return null;

    return (

        <motion.nav {...fadeUp(0.05)}
            className="relative z-10 flex items-center justify-between px-8 py-5"
            style={{ borderBottom: "1px solid var(--border)" }}>
            <Link href="/">
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700 }}>
                    Dev<span style={{ color: "var(--accent)" }}>Keep</span>
                </span>
            </Link>

            {/* login page */}
            <div className="flex items-center gap-3 ml-auto" >
                {pathname === "/login" && (
                    <Link
                        href="/"
                        className=" text-xs px-4 py-1.5 rounded tracking-widest transition-all hover:opacity-80"
                        style={{
                            color: "var(--accent)",
                            opacity: 0.8,
                            textDecoration: "none",
                            border: "1px solid var(--border)",
                        }}
                    >
                        ← back to home
                    </Link>
                )}
            </div>

            {pathname === "/" && (
                <div className="hidden md:flex gap-6 text-xs tracking-widest" style={{ color: "var(--accent)" }}>
                    {["features", "How it works", "contact"].map((item, i) => (
                        <Link
                            key={i}
                            href={`#${item.toLowerCase().replace(/\s+/g, "")}`}
                            className="relative group"
                        >
                            {item}

                            <span className="absolute left-0 -bottom-1 h-px w-0 bg-(--accent) transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    ))}
                </div>
            )}
            <div className=" flex items-center gap-2">
                <ThemeToggle />
                {pathname === "/" && (
                    <Link href="/login"
                        className="text-xs px-4 py-1.5 rounded tracking-widest transition-all hover:opacity-80"
                        style={{ border: "1px solid var(--accent)", color: "var(--accent)", fontFamily: "inherit" }}>
                        sign in
                    </Link>
                )}

                {/* CREATE */}
                {pathname === "/create" && (
                    <>
                        <span
                            className="text-xs tracking-widest opacity-60"
                            style={{ color: "var(--accent)" }}
                        >
                            unsaved
                        </span>

                        <button
                            onClick={logout}
                            className="text-xs px-3 py-1.5 rounded tracking-widest cursor-pointer"
                            style={{
                                border: "1px solid var(--border)",
                                color: "var(--accent)",
                                background: "transparent",
                            }}
                        >
                            sign out
                        </button>
                    </>
                )}
            </div>
        </motion.nav>

    );
}
