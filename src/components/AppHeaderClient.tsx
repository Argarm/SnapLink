"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import LogoutButton from "./LogoutButton";

export default function AppHeaderClient({ email }: { email?: string }) {
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
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
      <div className="flex gap-2 md:hidden">
        {!email && (
          <button
            className="p-2 rounded bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => setMobileMenu((v) => !v)}
            aria-label="Abrir menú"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        )}
      </div>
      <div className="gap-2 hidden md:flex">
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
              className="px-5 py-2 rounded bg-gray-100 text-blue-700 font-semibold hover:bg-gray-200 transition focus:outline-none flex items-center gap-2 shadow-sm border border-gray-200"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="truncate max-w-[120px]">{email}</span>
              <svg className={`ml-1 w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-blue-100 rounded-xl shadow-2xl z-20 animate-fade-in overflow-hidden ring-1 ring-blue-100">
                <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="font-semibold text-blue-700 text-sm truncate">{email}</span>
                </div>
                <Link
                  href="/auth/links"
                  className="block px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition text-sm font-medium"
                  onClick={() => setOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" /></svg>
                    Mis enlaces
                  </span>
                </Link>
                <div className="border-t border-blue-100 my-1" />
                <div className="px-5 py-3">
                  <LogoutButton />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Menú móvil */}
      {mobileMenu && !email && (
        <div className="fixed inset-0 z-30 bg-black/40 flex justify-end md:hidden" onClick={() => setMobileMenu(false)}>
          <nav className="w-64 bg-white h-full shadow-lg p-8 flex flex-col gap-6 animate-slide-in-right" onClick={e => e.stopPropagation()}>
            <button className="self-end mb-6" onClick={() => setMobileMenu(false)} aria-label="Cerrar menú">
              <svg className="w-7 h-7 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <Link
              href="/auth/login"
              className="block w-full px-5 py-3 rounded bg-blue-600 text-white font-semibold text-center hover:bg-blue-700 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              onClick={() => setMobileMenu(false)}
            >
              Iniciar sesión
            </Link>
            <Link
              href="/auth/register"
              className="block w-full px-5 py-3 rounded bg-green-600 text-white font-semibold text-center hover:bg-green-700 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
              onClick={() => setMobileMenu(false)}
            >
              Registrarse
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
