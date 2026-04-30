'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'          // Ajout
import { Button } from '@/components/ui/button'
import {
  Search,
  PlusCircle,
  CheckCircle,
  MapPin,
  Zap,
  ArrowRight,
  Shield,
  Users,
  Smartphone,
  CreditCard,
  Key,
  Briefcase,
  Lock,
  Package,
} from 'lucide-react'
import { fetchCategories, fetchCommunauteStats, fetchObjetsPage } from '@/lib/api'
import AnnonceCard from '@/components/annonce/AnnonceCard'
import { HomeStoryCarousel } from '@/components/home/HomeStoryCarousel'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import SkeletonCard from '@/components/ui/SkeletonCard'
import type { Item } from '@/types'
import { useAppStore } from '@/store/useAppStore'   // Ajout

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1734868198180-645349d586f4?w=1920&q=85'

const trust = [
  { icon: Shield, label: 'Données traitées avec soin' },
  { icon: Lock, label: 'Messagerie intégrée' },
  { icon: Users, label: 'Communauté citoyenne' },
]

function iconForCategoryName(nom: string) {
  const n = nom.toLowerCase()
  if (n.includes('téléphone') || n.includes('telephone') || n.includes('phone')) return Smartphone
  if (n.includes('identité') || n.includes('identite') || n.includes('carte')) return CreditCard
  if (n.includes('clé') || n.includes('cle')) return Key
  if (n.includes('bagage') || n.includes('sac') || n.includes('valise')) return Briefcase
  return Package
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [totalSignalés, setTotalSignalés] = useState<number | null>(null)
  const [totalRestitutions, setTotalRestitutions] = useState<number | null>(null)
  const [previewItems, setPreviewItems] = useState<Item[]>([])
  const [categories, setCategories] = useState<{ id: number; nom: string; description: string | null }[]>([])
  const [personnesActives, setPersonnesActives] = useState<number | null>(null)

  // Récupération de l'utilisateur et du router
  const user = useAppStore((state) => state.user)
  const router = useRouter()

  useEffect(() => {
    let cancelled = false
    async function load() {
      setIsLoading(true)
      setLoadError(null)
      try {
        const [allPage, resoluPage, cats, communaute] = await Promise.all([
          fetchObjetsPage({ page: 0, size: 6 }),
          fetchObjetsPage({ page: 0, size: 1, statut: 'RESOLVED' }),
          fetchCategories().catch(() => [] as Awaited<ReturnType<typeof fetchCategories>>),
          fetchCommunauteStats().catch(() => null),
        ])
        if (cancelled) return
        setTotalSignalés(allPage.pagination.total)
        setTotalRestitutions(resoluPage.pagination.total)
        setPreviewItems(allPage.items)
        setCategories(cats)
        setPersonnesActives(communaute?.personnesActives ?? null)
      } catch (e) {
        if (!cancelled) {
          setLoadError(
            e instanceof Error ? e.message : 'Impossible de charger les données depuis le serveur.'
          )
          setTotalSignalés(null)
          setTotalRestitutions(null)
          setPreviewItems([])
          setCategories([])
          setPersonnesActives(null)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  // Fonctions de redirection conditionnelle
  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/inscription')
    }
  }

  const handleCreateAccount = () => {
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/inscription')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  }

  const itemVariants = {
    hidden: { y: 16, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
    },
  }

  return (
    <div className="flex min-w-0 flex-col bg-background">
      {loadError && (
        <div
          role="alert"
          className="border-b border-amber-200/80 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100"
        >
          {loadError} — certaines sections peuvent être incomplètes.
        </div>
      )}
      {/* Hero plein écran */}
      <section className="relative min-h-[100dvh] w-full min-w-0 max-w-[100vw] overflow-hidden">
        <Image
          src={HERO_IMAGE}
          alt="Personnes au Togo, solidarité et vie quotidienne"
          fill
          priority
          className="object-cover object-[center_38%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-[#0c447c]/82 to-primary/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25" />
        <div
          className="absolute inset-0 opacity-[0.2]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="pointer-events-none absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
          <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/50">Défiler</span>
          <div className="h-12 w-px bg-gradient-to-b from-white/70 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full min-w-0 max-w-[90rem] flex-col justify-end px-5 pb-10 pt-24 sm:px-8 sm:pb-12 lg:px-12 lg:pb-14 lg:pt-28">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full min-w-0 max-w-[38rem]"
          >
            <motion.p variants={itemVariants} className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/75">
              Plateforme citoyenne · Togo
            </motion.p>

            <motion.h1
              variants={itemVariants}
              className="display-heading text-[2.65rem] font-medium leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.5rem] xl:text-[3.85rem]"
            >
              Réinventons
              <br />
              <span className="text-white">la solidarité</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/88 sm:text-lg"
            >
              Objets perdus ou trouvés : un signalement clair, des correspondances utiles et des échanges sécurisés —
              du téléphone au bureau.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
            >
              <Link href="/annonces">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-[52px] min-w-[220px] rounded-full border-2 border-white/70 bg-black/30 px-8 text-[15px] font-medium text-white backdrop-blur-sm hover:bg-black/45"
                >
                  Découvrir TrouvTogo
                  <ArrowRight className="ml-2 h-[18px] w-[18px]" strokeWidth={1.75} />
                </Button>
              </Link>
              {/* Bouton "Commencer gratuitement" corrigé */}
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="h-[52px] min-w-[220px] rounded-full border border-primary/90 bg-primary px-8 text-[15px] font-semibold text-white hover:bg-primary-dark"
              >
                {user ? 'Accéder au tableau de bord' : 'Commencer gratuitement'}
              </Button>
            </motion.div>

            <motion.ul
              variants={itemVariants}
              className="mt-12 flex flex-col gap-3 border-t border-white/20 pt-10 sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-2"
            >
              {trust.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5 text-[13px] font-medium text-white/70">
                  <Icon className="h-4 w-4 shrink-0 text-white/55" strokeWidth={1.5} />
                  {label}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Stats intégrées */}
            <div className="relative z-20 mx-auto mt-12 w-full min-w-0 max-w-[88rem] sm:mt-14">
            <div className="overflow-hidden rounded-2xl border border-border/20 bg-card/10 shadow-none backdrop-blur-md dark:border-border/15 dark:bg-black/25">
              <div className="grid divide-y divide-border/15 md:grid-cols-3 md:divide-x md:divide-y-0 dark:divide-border/10">
                {[
                  { label: 'Objets signalés', value: isLoading ? null : totalSignalés, icon: Search },
                  { label: 'Restitutions', value: isLoading ? null : totalRestitutions, icon: CheckCircle },
                  {
                    label: 'Personnes actives',
                    value: isLoading ? null : personnesActives,
                    icon: Users,
                    title:
                      'Nombre de personnes distinctes ayant au moins un signalement encore actif sur la plateforme.',
                  },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className="flex items-center justify-between gap-6 px-6 py-6 sm:px-8 sm:py-7 lg:px-10"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                  >
                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-card/20">
                        <stat.icon className="h-5 w-5 text-white" strokeWidth={1.75} />
                      </div>
                      <span
                        className="text-[13px] font-medium text-white/85"
                        title={'title' in stat ? stat.title : undefined}
                      >
                        {stat.label}
                      </span>
                    </div>
                    {isLoading ? (
                      <div className="h-9 w-20 animate-pulse rounded-md bg-card/20 dark:bg-card/10" />
                    ) : stat.value != null ? (
                      <span className="font-heading text-3xl font-semibold tabular-nums tracking-tight text-white">
                        {stat.value.toLocaleString('fr-FR')}
                      </span>
                    ) : (
                      <span className="font-heading text-2xl font-semibold text-white/70">—</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <HomeStoryCarousel />

      {/* Étapes */}
      <section
        id="comment-ca-marche"
        className="scroll-mt-28 mx-auto max-w-[88rem] px-4 py-20 sm:px-6 lg:px-10 lg:py-28"
      >
        <div className="mb-14 max-w-2xl">
          <p className="eyebrow text-primary">Parcours</p>
          <h2 className="display-heading mt-3 text-3xl text-foreground sm:text-4xl">
            Trois étapes, un objectif clair
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
            Du signalement à la remise en main propre, chaque écran est là pour vous faire gagner du temps.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {[
            {
              step: '01',
              title: 'Déclarer',
              desc: 'Perdu ou trouvé : formulaire guidé, catégories et photos en quelques minutes.',
              icon: PlusCircle,
            },
            {
              step: '02',
              title: 'Correspondre',
              desc: 'Le moteur propose des scores de similarité pour prioriser les bons contacts.',
              icon: Zap,
            },
            {
              step: '03',
              title: 'Échanger',
              desc: 'Messagerie intégrée pour convenir d’un rendez-vous sans exposer inutilement vos coordonnées.',
              icon: CheckCircle,
            },
          ].map((item, i) => (
            <motion.article
              key={item.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="group relative rounded-2xl border border-neutral-200/50 bg-card p-8 transition-colors hover:border-primary/25 dark:border-neutral-700/80 dark:hover:border-neutral-600"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <span className="font-heading text-4xl font-medium tabular-nums text-neutral-300 transition-colors group-hover:text-primary/35 dark:text-neutral-700 dark:group-hover:text-primary/40">
                  {item.step}
                </span>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <item.icon className="h-6 w-6" strokeWidth={1.75} />
                </div>
              </div>
              <h3 className="font-heading text-xl font-medium text-card-foreground">{item.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{item.desc}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Avantages */}
      <section
        id="pourquoi"
        className="scroll-mt-28 bg-primary py-20 text-primary-foreground dark:bg-[#12161c] dark:text-foreground lg:py-24"
      >
        <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-10">
          <div className="mb-14 flex max-w-2xl flex-col gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75 dark:text-white/50">
              Pourquoi ce service
            </p>
            <h2 className="display-heading text-3xl font-medium text-white sm:text-4xl dark:text-white">
              Pensé pour être utile au quotidien
            </h2>
            <p className="text-[17px] leading-relaxed text-white/85 dark:text-neutral-400">
              Pas de surcharge visuelle : des fonctions qui répondent à de vrais besoins terrain.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Scoring',
                desc: 'Indice de confiance sur chaque correspondance potentielle.',
                icon: Zap,
              },
              {
                title: 'Carte',
                desc: 'Visualisez les signalements autour de vous.',
                icon: MapPin,
              },
              {
                title: 'Confidentialité',
                desc: 'Échangez d’abord dans l’application.',
                icon: Smartphone,
              },
              {
                title: 'Accès',
                desc: 'Service entièrement gratuit pour les usagers.',
                icon: Shield,
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border/20 bg-card/10 p-8 backdrop-blur-[2px] dark:border-border/10 dark:bg-[#1a1f26]"
              >
                <feature.icon
                  className="mb-5 h-5 w-5 text-white dark:text-primary-light"
                  strokeWidth={1.5}
                />
                <h3 className="font-heading text-lg font-medium text-white dark:text-white">{feature.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-white/80 dark:text-neutral-500">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Annonces */}
      <section className="mx-auto max-w-[88rem] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-primary">Aperçu</p>
            <h2 className="display-heading mt-2 text-3xl text-foreground sm:text-4xl">Derniers signalements</h2>
            <p className="mt-3 max-w-lg text-[17px] text-muted-foreground">
              Derniers enregistrements issus de la plateforme — ouvrez une fiche pour plus de détails.
            </p>
          </div>
          <Link href="/annonces">
            <Button
              variant="outline"
              className="h-11 rounded-full border-neutral-300 px-6 text-[14px] font-medium dark:border-neutral-600 dark:bg-transparent dark:hover:bg-neutral-800"
            >
              Voir tout
              <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.75} />
            </Button>
          </Link>
        </div>

        <div className="grid auto-rows-fr gap-6 md:grid-cols-2 xl:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : previewItems.length === 0
              ? (
                  <p className="col-span-full rounded-2xl border border-dashed border-neutral-300 bg-muted/30 px-6 py-12 text-center text-[15px] text-muted-foreground dark:border-neutral-600">
                    Aucun signalement pour le moment. Revenez plus tard ou publiez le vôtre depuis « Déclarer ».
                  </p>
                )
              : previewItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ delay: idx * 0.05, duration: 0.35 }}
                    className="h-full min-h-0"
                  >
                    <AnnonceCard item={item} />
                  </motion.div>
                ))}
        </div>
      </section>

      {/* Catégories */}
      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-10">
          <div className="mb-12 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Fréquence</p>
            <h2 className="display-heading mt-2 text-3xl text-foreground sm:text-4xl">
              Catégories souvent signalées
            </h2>
          </div>

          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-36 animate-pulse rounded-2xl border border-neutral-200/50 bg-muted/40 dark:border-neutral-700/80"
                />
              ))
            ) : categories.length === 0 ? (
              <p className="col-span-full text-center text-[15px] text-muted-foreground">
                Les catégories seront affichées dès qu’elles seront disponibles sur le serveur.
              </p>
            ) : (
              categories.slice(0, 8).map((cat, i) => {
                const CatIcon = iconForCategoryName(cat.nom)
                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-2xl border border-neutral-200/50 bg-card px-5 py-6 text-center shadow-none transition-colors hover:border-primary/35 dark:border-neutral-700/80 dark:bg-card dark:hover:border-neutral-600"
                  >
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20">
                      <CatIcon className="h-6 w-6" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-heading text-[15px] font-medium text-foreground">{cat.nom}</h3>
                    {cat.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-neutral-600 dark:text-neutral-400">
                        {cat.description}
                      </p>
                    )}
                  </motion.div>
                )
              })
            )}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-[88rem] px-4 py-20 sm:px-6 lg:px-10 lg:py-24">
        <div className="overflow-hidden rounded-2xl border border-primary-dark/20 bg-primary px-8 py-14 text-center sm:px-14 dark:border-primary/50 dark:bg-primary/90">
          <h2 className="display-heading text-2xl text-white sm:text-3xl">Rejoindre TrouvTogo</h2>
          <p className="mx-auto mt-4 max-w-lg text-[17px] leading-relaxed text-white/85">
            Créez un compte en une minute, ou parcourez les annonces sans engagement.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {/* Bouton "Créer un compte" corrigé */}
            <Button
              size="lg"
              onClick={handleCreateAccount}
              className="h-12 min-w-[200px] rounded-full border border-border/30 bg-card px-8 text-[15px] font-medium text-primary hover:bg-neutral-100"
            >
              {user ? 'Accéder au tableau de bord' : 'Créer un compte'}
            </Button>
            <Link href="/annonces">
              <Button
                size="lg"
                variant="outline"
                className="h-12 min-w-[200px] rounded-full border-border/50 bg-transparent px-8 text-[15px] font-medium text-white hover:bg-card/10"
              >
                Parcourir les annonces
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}