'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import {
  Bell,
  LogOut,
  Menu,
  LayoutDashboard,
  Globe,
  ChevronDown,
  User as UserIcon,
  Settings,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import type { User } from '@/types'
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

const appNav = (user: User | null) => {
  if (!user) return []
  if (user.role === 'ADMIN') {
    return [
      { name: 'Dashboard', href: '/admin/dashboard' },
      { name: 'Modération', href: '/admin/moderation' },
      { name: 'Catégories', href: '/admin/categories' },
    ]
  }
  return [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Mes annonces', href: '/mes-annonces' },
  ]
}

const getNavLinks = (user: User | null, isHome: boolean) => {
  if (!user) return isHome ? [...marketingNav, ...mainNav] : [mainNav[0]]
  if (user.role === 'ADMIN') return appNav(user)
  return appNav(user)
}

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
  const router = useRouter()
  const { user, clearAuth, unreadNotifications } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isHome = pathname === '/'
  const centerLinks = getNavLinks(user, isHome)
  const onHero = isHome && !scrolled
  const isAdmin = user?.role === 'ADMIN'

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
    const onScroll = () => setIsOpen(false)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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
      active ? 'text-foreground' : 'text-foreground/90 hover:text-foreground'
    )

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-[background-color,backdrop-filter] duration-300',
        isHome && !scrolled ? 'bg-transparent' : 'bg-card backdrop-blur-sm'
      )}
    >
      <div className="mx-auto flex min-h-[4.25rem] max-w-[90rem] items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 lg:px-10">
        <Link
          href="/"
          className={cn(
            'group shrink-0 font-heading text-[1.35rem] font-medium tracking-tight sm:text-[1.5rem] lg:text-[1.6rem]',
            'text-foreground'
          )}
        >
          <span>Trouv</span>
          <span className={cn('transition-colors text-primary group-hover:text-primary-dark')}>Togo</span>
        </Link>

        {/* Liens plats centrés */}
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

          {!isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  'hidden items-center gap-2 rounded-lg px-2.5 py-2 text-[15px] font-medium outline-none transition-colors lg:inline-flex',
                  'text-foreground hover:text-primary'
                )}
              >
                <Globe className="h-[1.125rem] w-[1.125rem] shrink-0 opacity-90" strokeWidth={1.5} />
                <span className="hidden sm:inline">Français</span>
                <ChevronDown className="h-4 w-4 opacity-70" strokeWidth={2} />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="min-w-[10rem] rounded-xl border border-border bg-popover p-1 text-foreground"
              >
                <DropdownMenuItem className="rounded-lg text-[15px]">Français</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {user ? (
            <>
              {!isAdmin && (
                <Link href="/notifications" className="hidden sm:block">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn('relative h-11 w-11 rounded-full', 'text-foreground hover:bg-popover/60')}
                  >
                    <Bell className="h-[1.35rem] w-[1.35rem]" strokeWidth={1.75} />
                    {unreadNotifications > 0 && (
                      <span
                        className={cn(
                          'absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger ring-2',
                          'ring-white/30 dark:ring-white/20'
                        )}
                      />
                    )}
                  </Button>
                </Link>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(
                    'rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-primary/35',
                    'ring-offset-transparent dark:ring-offset-white/95'
                  )}
                >
                  <span className={cn('flex items-center gap-2 rounded-full border py-1 pl-2.5 pr-1 transition-colors', 'border-border bg-popover hover:border-primary')}>
                    <span className={cn('hidden max-w-[10rem] truncate text-[15px] font-medium lg:inline', 'text-foreground')}>
                      {user.name.split(' ')[0]}
                    </span>
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage src={user.avatar || ''} alt={user.name} />
                      <AvatarFallback className="bg-primary text-[15px] font-medium text-white">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </span>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="mt-2 w-56 rounded-xl border border-border bg-popover p-1.5 text-foreground" align="end">
                  <DropdownMenuItem
                    onClick={() => router.push(isAdmin ? '/admin/dashboard' : '/dashboard')}
                    className="flex items-center gap-2 text-[15px] font-medium px-3 py-2.5 cursor-pointer rounded-lg"
                  >
                    <LayoutDashboard className="h-4 w-4 text-primary" strokeWidth={1.75} />
                    Dashboard
                  </DropdownMenuItem>

                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator className="bg-border dark:bg-neutral-700" />
                      <DropdownMenuItem
                        onClick={() => router.push('/admin/profil')}
                        className="flex items-center gap-2 text-[15px] font-medium px-3 py-2.5 cursor-pointer rounded-lg"
                      >
                        <UserIcon className="h-4 w-4" strokeWidth={1.75} />
                        Mon Profil
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push('/admin/settings')}
                        className="flex items-center gap-2 text-[15px] font-medium px-3 py-2.5 cursor-pointer rounded-lg"
                      >
                        <Settings className="h-4 w-4" strokeWidth={1.75} />
                        Paramètres
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator className="bg-border dark:bg-neutral-700" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-[15px] font-medium px-3 py-2.5 cursor-pointer rounded-lg text-danger focus:text-danger"
                  >
                    <LogOut className="h-4 w-4" strokeWidth={1.75} />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost" size="default" className="h-11 rounded-full px-5 text-[15px] font-medium sm:px-6 text-foreground">
                  Connexion
                </Button>
              </Link>
              <Link href="/annonces" className="hidden md:block">
                <Button size="default" className="h-11 rounded-full px-5 text-[12px] font-semibold uppercase tracking-[0.12em] sm:px-7 sm:text-[13px]">
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
                'border-border/45 bg-card/10 text-white hover:bg-card/20 dark:border-neutral-400/50 dark:bg-black/15 dark:text-neutral-700 dark:hover:bg-black/25'
              )}
            >
              <Menu className="h-4 w-4" strokeWidth={1.75} />
            </Button>

            {isOpen && (
              <div className="fixed inset-0 z-[100] md:hidden" role="presentation">
                <button
                  type="button"
                  className="absolute inset-0 bg-neutral-950/85 backdrop-blur-[6px] transition-opacity dark:bg-black/85"
                  aria-label="Fermer le menu"
                  onClick={() => setIsOpen(false)}
                />
                <div
                  id="menu-mobile-glass"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Navigation"
                  className="pointer-events-auto absolute inset-x-3 top-[calc(4rem+env(safe-area-inset-top,0px))] bottom-[max(0.5rem,env(safe-area-inset-bottom,0px))] flex flex-col rounded-[1.75rem] border border-primary/70 bg-primary text-white p-4 shadow-[0_28px_90px_-16px_rgba(15,23,42,0.4)] dark:border-white/[0.15] dark:bg-neutral-900 dark:text-foreground sm:p-5"
                >
                  <div className="mb-3 flex shrink-0 items-center justify-between gap-3 border-b border-border/30 pb-3 dark:border-border/20">
                    <p className="font-heading text-lg font-medium tracking-tight text-white dark:text-white">
                      Trouv<span className="text-white/90 dark:text-white/90">Togo</span>
                    </p>
                    <span className="rounded-full bg-card/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80 dark:bg-card/15 dark:text-white/70">
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
                                ? 'bg-card/25 text-white dark:bg-card/20 dark:text-white'
                                : 'text-white/90 hover:bg-card/15 dark:text-white/80 dark:hover:bg-card/[0.12]'
                          )}
                        >
                          {link.name}
                        </Link>
                      )
                    })}
                  </nav>

                  <div className="mt-3 shrink-0 space-y-3 border-t border-border/30 pt-4 dark:border-border/20">
                    <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/40 bg-card/15 px-3 py-2.5 dark:border-border/20 dark:bg-card/[0.08] sm:px-4 sm:py-3">
                      <span className="text-[13px] font-medium text-white dark:text-white/80">Thème</span>
                      <ThemeToggle hero={onHero} />
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
                          className="block rounded-2xl border border-border/40 bg-card/20 py-2.5 text-center text-[15px] font-medium text-white dark:border-border/25 dark:bg-card/[0.12] dark:text-white sm:py-3"
                        >
                          Connexion
                        </Link>

                        <Link
                          href="/inscription"
                          onClick={() => setIsOpen(false)}
                          className="block rounded-2xl border border-dashed border-border/40 py-2.5 text-center text-[15px] font-medium text-white dark:border-border/40 dark:text-white sm:py-3"
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