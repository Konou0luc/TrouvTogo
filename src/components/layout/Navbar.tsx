'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import {
  Bell,
  LogOut,
  Menu,
  LayoutDashboard,
  Globe,
  ChevronDown,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { cn } from '@/lib/utils'

const mainNav = [{ name: 'Annonces', href: '/annonces' }]

const marketingNav = [
  { name: 'Comment ça marche', href: '/#comment-ca-marche' },
  { name: 'Pourquoi TrouvTogo', href: '/#pourquoi' },
]

const appNav = (user: { id: number } | null) =>
  user
    ? [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Mes annonces', href: '/mes-annonces' },
        { name: 'Matchs', href: '/matches' },
        { name: 'Messages', href: '/messages' },
      ]
    : []

function isActive(pathname: string, href: string) {
  if (href.includes('#')) {
    const raw = href.split('#')[0]
    const base = raw === '' || raw === undefined ? '/' : raw
    if (base === '/') return pathname === '/'
    return pathname === base || pathname.startsWith(`${base}/`)
  }
  return pathname === href || (href !== '/' && pathname.startsWith(href))
}

export default function Navbar() {
  const pathname = usePathname()
  const { user, clearAuth, unreadNotifications } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isHome = pathname === '/'
  const centerLinks = [...marketingNav, ...mainNav, ...appNav(user)]
  const onHero = isHome && !scrolled

  useEffect(() => {
    if (!isHome) return
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  const handleLogout = () => {
    clearAuth()
    window.location.href = '/'
  }

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  const linkClass = (active: boolean) =>
    cn(
      'whitespace-nowrap text-[15px] font-medium leading-snug transition-colors lg:text-base',
      onHero
        ? active
          ? 'text-white'
          : 'text-white/80 hover:text-white'
        : active
          ? 'text-foreground'
          : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-foreground'
    )

  return (
    <header
      className={cn(
        'top-0 z-50 w-full transition-[background-color,border-color,backdrop-filter] duration-300',
        isHome
          ? 'fixed'
          : 'sticky border-b border-neutral-200/90 bg-[#fafaf8]/95 backdrop-blur-md supports-[backdrop-filter]:bg-[#fafaf8]/90 dark:border-neutral-800 dark:bg-neutral-950/90 dark:supports-[backdrop-filter]:bg-neutral-950/85',
        isHome && onHero && 'border-transparent bg-transparent',
        isHome &&
          scrolled &&
          'border-neutral-200/90 bg-[#fafaf8]/95 backdrop-blur-md supports-[backdrop-filter]:bg-[#fafaf8]/90 dark:border-neutral-800 dark:bg-neutral-950/90 dark:supports-[backdrop-filter]:bg-neutral-950/85'
      )}
    >
      <div className="mx-auto flex min-h-[4.25rem] max-w-[90rem] items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 lg:px-10">
        <Link
          href="/"
          className={cn(
            'group shrink-0 font-heading text-[1.35rem] font-medium tracking-tight sm:text-[1.5rem] lg:text-[1.6rem]',
            onHero ? 'text-white' : 'text-foreground'
          )}
        >
          <span>Trouv</span>
          <span
            className={cn(
              'transition-colors',
              onHero ? 'text-white group-hover:text-white/90' : 'text-primary group-hover:text-primary-dark'
            )}
          >
            Togo
          </span>
        </Link>

        {/* Liens plats centrés — pas de conteneur « pilule » */}
        <nav className="hidden min-w-0 flex-1 justify-center md:flex">
          <ul className="flex max-w-full flex-wrap items-center justify-center gap-x-7 lg:gap-x-10 xl:gap-x-11">
            {centerLinks.map((link) => {
              const active = isActive(pathname, link.href)
              return (
                <li key={`${link.href}-${link.name}`}>
                  <Link href={link.href} className={linkClass(active)}>
                    {link.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <div className="hidden md:block">
            <ThemeToggle hero={onHero} />
          </div>
          {/* Langue — discret, comme les refs. type WeHeal */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                'hidden items-center gap-2 rounded-lg px-2.5 py-2 text-[15px] font-medium outline-none transition-colors lg:inline-flex',
                onHero
                  ? 'text-white/85 hover:text-white'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-foreground'
              )}
            >
              <Globe className="h-[1.125rem] w-[1.125rem] shrink-0 opacity-90" strokeWidth={1.5} />
              <span className="hidden sm:inline">Français</span>
              <ChevronDown className="h-4 w-4 opacity-70" strokeWidth={2} />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="min-w-[10rem] rounded-xl border border-neutral-200 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <DropdownMenuItem className="rounded-lg text-[15px]">Français</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <>
              <Link href="/notifications" className="hidden sm:block">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'relative h-11 w-11 rounded-full',
                    onHero
                      ? 'text-white/90 hover:bg-white/15 hover:text-white'
                      : 'text-neutral-600 hover:bg-neutral-200/60 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-foreground'
                  )}
                >
                  <Bell className="h-[1.35rem] w-[1.35rem]" strokeWidth={1.75} />
                  {unreadNotifications > 0 && (
                    <span
                      className={cn(
                        'absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger ring-2',
                        onHero ? 'ring-white/30' : 'ring-[#fafaf8] dark:ring-neutral-950'
                      )}
                    />
                  )}
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(
                    'rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-primary/35',
                    onHero ? 'ring-offset-transparent' : 'ring-offset-[#fafaf8]'
                  )}
                >
                  <span
                    className={cn(
                      'flex items-center gap-2 rounded-full border py-1 pl-2.5 pr-1 transition-colors',
                      onHero
                        ? 'border-white/35 bg-white/10 hover:border-white/50'
                        : 'border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-600'
                    )}
                  >
                    <span
                      className={cn(
                        'hidden max-w-[10rem] truncate text-[15px] font-medium lg:inline',
                        onHero ? 'text-white' : 'text-foreground'
                      )}
                    >
                      {user.name.split(' ')[0]}
                    </span>
                    <Avatar className="h-10 w-10 border border-neutral-100">
                      <AvatarImage src={user.avatar || ''} alt={user.name} />
                      <AvatarFallback className="bg-primary text-[15px] font-medium text-white">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="mt-2 w-56 rounded-xl border border-neutral-200 bg-white p-1.5 dark:border-neutral-700 dark:bg-neutral-900"
                  align="end"
                >
                  <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2.5 focus:bg-neutral-50">
                    <Link href="/dashboard" className="flex w-full items-center gap-2 text-[15px] font-medium">
                      <LayoutDashboard className="h-4 w-4 text-primary" strokeWidth={1.75} />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-neutral-100" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer rounded-lg px-3 py-2.5 text-danger focus:bg-danger-light/30"
                  >
                    <span className="flex items-center gap-2 text-[15px] font-medium">
                      <LogOut className="h-4 w-4" strokeWidth={1.75} />
                      Déconnexion
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block">
                <Button
                  variant="ghost"
                  size="default"
                  className={cn(
                    'h-11 rounded-full px-5 text-[15px] font-medium sm:px-6',
                    onHero
                      ? 'text-white/90 hover:bg-white/10 hover:text-white'
                      : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-foreground'
                  )}
                >
                  Connexion
                </Button>
              </Link>
              <Link href="/annonces" className="hidden md:block">
                <Button
                  size="default"
                  className="h-11 rounded-full px-5 text-[12px] font-semibold uppercase tracking-[0.12em] sm:px-7 sm:text-[13px]"
                >
                  Voir les annonces
                </Button>
              </Link>
            </>
          )}

          <div className="md:hidden">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-expanded={isOpen}
              aria-controls="menu-mobile-glass"
              aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              onClick={() => setIsOpen((o) => !o)}
              className={cn(
                'rounded-full',
                onHero
                  ? 'border-white/45 bg-white/10 text-white hover:bg-white/20'
                  : 'border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900/80 dark:text-foreground'
              )}
            >
              <Menu className="h-4 w-4" strokeWidth={1.75} />
            </Button>

            {isOpen && (
              <div className="fixed inset-0 z-[100] md:hidden" role="presentation">
                <button
                  type="button"
                  className="absolute inset-0 bg-neutral-950/35 backdrop-blur-[3px] transition-opacity dark:bg-black/55"
                  aria-label="Fermer le menu"
                  onClick={() => setIsOpen(false)}
                />
                <div
                  id="menu-mobile-glass"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Navigation"
                  className="pointer-events-auto absolute inset-x-3 top-[calc(4rem+env(safe-area-inset-top,0px))] bottom-[max(0.5rem,env(safe-area-inset-bottom,0px))] flex flex-col rounded-[1.75rem] border border-white/40 bg-white/[0.72] p-4 shadow-[0_28px_90px_-16px_rgba(15,23,42,0.35)] backdrop-blur-2xl dark:border-white/[0.12] dark:bg-neutral-950/[0.58] dark:shadow-black/50 sm:p-5"
                >
                  <div className="mb-3 flex shrink-0 items-center justify-between gap-3 border-b border-neutral-200/60 pb-3 dark:border-white/10">
                    <p className="font-heading text-lg font-medium tracking-tight text-neutral-900 dark:text-white">
                      Trouv<span className="text-primary">Togo</span>
                    </p>
                    <span className="rounded-full bg-neutral-900/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
                      Menu
                    </span>
                  </div>

                  <nav className="flex shrink-0 flex-col gap-0.5">
                    {centerLinks.map((link) => {
                      const active = isActive(pathname, link.href)
                      return (
                        <Link
                          key={`${link.href}-${link.name}`}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            'rounded-2xl px-3 py-2.5 text-[15px] font-medium transition-colors sm:py-3',
                            active
                              ? 'bg-primary/12 text-primary dark:bg-primary/20'
                              : 'text-neutral-700 hover:bg-neutral-900/[0.04] dark:text-neutral-200 dark:hover:bg-white/[0.06]'
                          )}
                        >
                          {link.name}
                        </Link>
                      )
                    })}
                  </nav>

                  <div className="mt-3 shrink-0 space-y-3 border-t border-neutral-200/70 pt-4 dark:border-white/10">
                    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/50 bg-white/50 px-3 py-2.5 dark:border-white/10 dark:bg-white/[0.04] sm:px-4 sm:py-3">
                      <span className="text-[13px] font-medium text-neutral-600 dark:text-neutral-300">
                        Thème
                      </span>
                      <ThemeToggle hero={false} />
                    </div>

                    {!user && (
                      <>
                        <Link href="/annonces" onClick={() => setIsOpen(false)} className="block">
                          <Button className="h-11 w-full rounded-2xl text-[12px] font-semibold uppercase tracking-[0.14em] shadow-sm sm:h-12">
                            Voir les annonces
                          </Button>
                        </Link>
                        <Link
                          href="/login"
                          onClick={() => setIsOpen(false)}
                          className="block rounded-2xl border border-neutral-200/90 bg-white/40 py-2.5 text-center text-[15px] font-medium text-neutral-700 backdrop-blur-sm dark:border-white/15 dark:bg-white/[0.04] dark:text-neutral-200 sm:py-3"
                        >
                          Connexion
                        </Link>
                        <Link
                          href="/inscription"
                          onClick={() => setIsOpen(false)}
                          className="block rounded-2xl border border-dashed border-neutral-300/90 py-2.5 text-center text-[15px] font-medium text-neutral-600 dark:border-neutral-600 dark:text-neutral-400 sm:py-3"
                        >
                          Créer un compte
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
