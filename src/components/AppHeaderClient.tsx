"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import LogoutButton from "./LogoutButton";

export default function AppHeaderClient({ email }: { email?: string }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <header className="w-full flex items-center justify-between p-4 absolute top-0 left-0 z-10">
      <div className="flex gap-2">
        <Link href="/">
          <span className="text-3xl font-extrabold text-blue-700 hover:underline cursor-pointer">
            SnapLink
          </span>
        </Link>
      </div>
      <div className="flex gap-2">
        {!email && (
          <>
            <Link
              href="/auth/login"
              className="px-5 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/auth/register"
              className="px-5 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            >
              Registrarse
            </Link>
          </>
        )}
        {email && (
          <div className="relative" ref={dropdownRef}>
            <button
              className="px-5 py-2 rounded bg-gray-100 text-blue-700 font-semibold hover:bg-gray-200 transition focus:outline-none"
              onClick={() => setOpen((v) => !v)}
            >
              {email}
              <svg className="inline ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-20 animate-fade-in">
                <Link
                  href="/auth/links"
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"
                  onClick={() => setOpen(false)}
                >
                  Mis enlaces
                </Link>
                <div className="border-t my-1" />
                <LogoutButton />
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
