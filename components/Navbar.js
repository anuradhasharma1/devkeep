"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggler";


export default function Navbar() {
    return (
        <nav  >
            <div className="flex justify-between items-center px-8 py-6 border border-[#3e2f25]" >
                <h1 className="font-semibold text-lg">DevKeep</h1>

                <div className="flex gap-6 items-center text-sm">
                    <Link href="/features" className="nav-link">Features</Link>
                    <Link href="/contact" className="nav-link">Contact</Link>
                    <div> <ThemeToggle /></div>

                    <button className="border border-[#8b6f5a] px-4 py-1 rounded-lg hover:bg-[#8b6f5a] hover:text-white transition">
                        Sign in
                    </button>
                </div>
            </div>
        </nav>
    );
}