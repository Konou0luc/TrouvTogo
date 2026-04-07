// src/components/layout/Navbar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import {
  Bell,
  MessageSquare,
  Search,
  PlusCircle,
  User,
  LogOut,
  Menu,
  LayoutDashboard,
  Sparkles
} from 'lucide-react'
import { useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function Navbar() {
  const pathname = usePathname()
  const { user, clearAuth, unreadNotifications, unreadMessages } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Fil d\'annonces', href: '/annonces' },
  ]

  const authLinks = user ? [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Mes annonces', href: '/mes-annonces' },
    { name: 'Matchs', href: '/matches' },
    { name: 'Messages', href: '/messages' },
  ] : []

  const handleLogout = () => {
    clearAuth()
    window.location.href = '/'
  }

  return (
    <nav className={`fixed top-0 z-50 w-full transition-all duration-500 ${
      scrolled ? 'py-2' : 'py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className={`flex h-16 items-center justify-between px-6 rounded-2xl transition-all duration-500 ${
          scrolled 
            ? 'bg-white shadow-lg' 
            : 'bg-white shadow-md'
        }`}>
          {/* Logo Premium */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-2xl bg-neutral-900 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
              <Search className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-black text-neutral-900 tracking-tighter uppercase">
              Trouv<span className="text-primary italic">Togo</span>
            </span>
          </Link>

          {/* Desktop Nav: Centered & Minimalist */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xs font-black uppercase tracking-[0.2em] transition-all hover:text-primary ${
                  pathname === link.href ? 'text-primary' : 'text-neutral-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {user && (
              <>
                <div className="w-px h-6 bg-neutral-200" />
                {authLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-xs font-black uppercase tracking-[0.2em] transition-all hover:text-primary ${
                      pathname === link.href ? 'text-primary' : 'text-neutral-400'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/notifications">
                    <Button variant="ghost" size="icon" className="relative h-12 w-12 rounded-2xl hover:bg-neutral-100 transition-all">
                      <Bell className="h-5 w-5 text-neutral-900" />
                      {unreadNotifications > 0 && (
                        <span className="absolute top-3 right-3 h-2 w-2 bg-danger rounded-full border-2 border-white" />
                      )}
                    </Button>
                  </Link>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <div className="flex items-center gap-3 pl-2 py-1 pr-1 rounded-full border border-neutral-100 hover:border-primary transition-all cursor-pointer group">
                      <span className="text-xs font-black text-neutral-900 uppercase tracking-wider hidden lg:block">{user.name.split(' ')[0]}</span>
                      <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                        <AvatarImage src={user.avatar || ''} alt={user.name} />
                        <AvatarFallback className="bg-primary text-white font-black">{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 mt-4 p-3 rounded-[2rem] border-none shadow-2xl bg-white/95 backdrop-blur-xl" align="end">
                    <DropdownMenuItem className="rounded-2xl p-4 focus:bg-primary/5 cursor-pointer">
                      <Link href="/dashboard" className="flex items-center w-full font-black text-xs uppercase tracking-widest">
                        <LayoutDashboard className="mr-3 h-4 w-4 text-primary" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-2 bg-neutral-50" />
                    <DropdownMenuItem onClick={handleLogout} className="rounded-2xl p-4 focus:bg-danger/5 text-danger cursor-pointer font-black text-xs uppercase tracking-widest">
                      <LogOut className="mr-3 h-4 w-4" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-neutral-900 transition-colors">
                  Connexion
                </Link>
                <Link href="/inscription">
                  <Button className="bg-neutral-900 hover:bg-primary text-white h-12 px-8 rounded-full font-black text-xs uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95">
                    S&apos;inscrire
                  </Button>
                </Link>
              </div>
            )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-neutral-100">
                    <Menu className="h-6 w-6 text-neutral-900" />
                  </Button>
                }
              />
              <SheetContent side="right" className="w-full sm:max-w-md border-none rounded-l-[3rem] p-12">
                <SheetHeader className="mb-12">
                  <SheetTitle className="text-left">
                    <span className="text-2xl font-black uppercase tracking-tighter">Trouv<span className="text-primary italic">Togo</span></span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-4xl font-black tracking-tighter hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                  {user && (
                    <>
                      <div className="h-px w-full bg-neutral-100 my-4" />
                      {authLinks.map((link) => (
                        <Link
                          key={link.name}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className="text-2xl font-bold tracking-tight hover:text-primary transition-colors"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </>
                  )}
                  <div className="h-px w-full bg-neutral-100 my-4" />
                  {!user && (
                    <div className="flex flex-col gap-6">
                      <Link href="/login" onClick={() => setIsOpen(false)} className="text-xl font-black uppercase tracking-widest text-neutral-400">Connexion</Link>
                      <Link href="/inscription" onClick={() => setIsOpen(false)}>
                        <Button className="w-full h-20 rounded-[2rem] text-xl font-black uppercase tracking-tighter bg-primary">Rejoindre le réseau</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
