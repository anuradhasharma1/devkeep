"use client";

import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    if (!mounted) return null;
    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="w-10 h-10 flex items-center justify-center  backdrop-blur-md hover:scale-105 transition"
        >
            <AnimatePresence mode="wait">
                {isDark ? (

                    <motion.svg
                        key="sun"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 text-yellow-500"
                        initial={{ rotate: -90, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        exit={{ rotate: 90, scale: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <path d="M12 18a6 6 0 100-12 6 6 0 000 12zm0 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm0-22a1 1 0 011 1v1a1 1 0 11-2 0V1a1 1 0 011-1zm11 11a1 1 0 011 1h-1a1 1 0 010-2h1a1 1 0 011 1zM2 12a1 1 0 011-1H2a1 1 0 010 2H1a1 1 0 011-1zm16.95 6.364a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM6.172 6.172a1 1 0 010 1.414l-.707.707A1 1 0 114.05 6.879l.707-.707a1 1 0 011.414 0zm12.02-1.414a1 1 0 011.414 0l.707.707A1 1 0 0118.9 7.293l-.707-.707a1 1 0 010-1.414zM5.464 18.536a1 1 0 011.414 0l.707.707A1 1 0 116.586 20.657l-.707-.707a1 1 0 010-1.414z" />
                    </motion.svg>
                ) : (

                    <motion.svg
                        key="moon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 text-black"
                        initial={{ rotate: -90, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        exit={{ rotate: 90, scale: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <path d="M21.752 15.002A9 9 0 1111 2.248a7 7 0 0010.752 12.754z" />
                    </motion.svg>

                )}
            </AnimatePresence>
        </button>
    );
}