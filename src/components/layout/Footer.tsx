// src/components/layout/Footer.tsx
import Link from 'next/link'
import { Search, Mail, Phone, Globe, ShieldCheck, Zap, ArrowUpRight } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden border-t border-neutral-800 bg-neutral-950 pt-20 pb-12 text-neutral-200">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 mb-24">
          {/* Brand & Mission */}
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-3 mb-8 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/40 bg-primary transition-opacity group-hover:opacity-90">
                <Search className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter">
                Trouv<span className="text-primary-light">Togo</span>
              </span>
            </Link>
            <p className="text-lg text-neutral-400 mb-10 leading-relaxed font-medium max-w-md">
              La première plateforme citoyenne intelligente au Togo. Nous utilisons la technologie pour renforcer la solidarité nationale et simplifier la récupération d'objets perdus.
            </p>
            <div className="flex gap-4">
              {['Facebook', 'Twitter', 'Instagram'].map((social) => (
                <a 
                    key={social} 
                    href="#" 
                    className="h-12 w-12 rounded-2xl bg-card/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 border border-border/5"
                  >
                  <Globe className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12">
            <div>
              <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8">Plateforme</h3>
              <ul className="space-y-4">
                {[
                  { name: 'Toutes les annonces', href: '/annonces' },
                  { name: 'Déclarer une perte', href: '/declarer/perdu' },
                  { name: 'Objet trouvé', href: '/declarer/trouve' },
                  { name: 'Comment ça marche', href: '#' },
                ].map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-neutral-400 hover:text-white transition-colors flex items-center group font-medium">
                      {item.name}
                      <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-all -translate-y-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8">Assistance</h3>
              <ul className="space-y-4">
                {[
                  { name: 'Centre d\'aide', href: '#' },
                  { name: 'Contactez-nous', href: '#' },
                  { name: 'Conseils sécurité', href: '#' },
                  { name: 'Confidentialité', href: '#' },
                ].map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-neutral-400 hover:text-white transition-colors flex items-center group font-medium">
                      {item.name}
                      <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-all -translate-y-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8">Contact</h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4 text-neutral-400 group">
                  <div className="h-10 w-10 rounded-xl bg-card/5 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-tighter mb-1">Email</p>
                    <span className="text-sm font-bold text-white">hello@trouvtogo.com</span>
                  </div>
                </li>
                <li className="flex items-start gap-4 text-neutral-400 group">
                  <div className="h-10 w-10 rounded-xl bg-card/5 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-tighter mb-1">Téléphone</p>
                    <span className="text-sm font-bold text-white">+228 90 00 00 00</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-border/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-black text-emerald-500 uppercase tracking-widest">
              <ShieldCheck className="h-4 w-4" />
              <span>Système sécurisé</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-black text-primary-light/90 uppercase tracking-widest">
              <Zap className="h-4 w-4" />
              <span>Matching actif</span>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-xs text-neutral-500 font-bold tracking-tight">
              © {currentYear} TrouvTogo. Développé avec ❤️ pour le Togo.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
