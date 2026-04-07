// src/app/page.tsx
'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Search, 
  PlusCircle, 
  CheckCircle, 
  MapPin, 
  Zap, 
  ArrowRight,
  Clock,
  Shield,
  Users,
  Smartphone,
  CreditCard,
  Key,
  Briefcase
} from 'lucide-react'
import { MOCK_STATS, MOCK_ITEMS } from '@/lib/mockData'
import AnnonceCard from '@/components/annonce/AnnonceCard'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import SkeletonCard from '@/components/ui/SkeletonCard'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }

  return (
    <div className="flex flex-col bg-background">
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-primary overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-primary" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/90 text-xs font-bold uppercase tracking-widest border border-white/20 backdrop-blur-sm">
                <Zap className="h-3.5 w-3.5" />
                Plateforme citoyenne togolaise
              </span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-tight"
            >
              RETROUVEZ VOS OBJETS <br />
              <span className="text-accent-light">PERDUS AU TOGO</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-base md:text-lg text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
            >
              La première plateforme de signalement et récupération d'objets perdus. 
              Signalez, matchez, récupérez — simplement et gratuitement.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/declarer/perdu">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-neutral-100 h-14 px-8 text-base font-bold rounded-xl shadow-xl transition-all hover:scale-105"
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  J'ai perdu un objet
                </Button>
              </Link>
              <Link href="/declarer/trouve">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 h-14 px-8 text-base font-bold rounded-xl transition-all hover:scale-105"
                >
                  J'ai trouvé un objet
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Objets signalés', value: isLoading ? null : MOCK_STATS.totalItems, icon: Search },
            { label: 'Objets retrouvés', value: isLoading ? null : MOCK_STATS.resolvedItems, icon: CheckCircle },
            { label: 'Utilisateurs actifs', value: isLoading ? null : MOCK_STATS.activeUsers, icon: Users },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              className="bg-white rounded-2xl p-8 shadow-md border border-neutral-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary-light flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                {isLoading ? (
                  <div className="h-10 w-24 bg-neutral-100 rounded-lg animate-pulse" />
                ) : (
                  <p className="text-4xl font-black text-primary tracking-tighter">{stat.value?.toLocaleString()}</p>
                )}
              </div>
              <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-neutral-900 mb-4 tracking-tight">
            Comment ça marche ?
          </h2>
          <p className="text-neutral-500 max-w-2xl mx-auto">
            Trois étapes simples pour retrouver votre objet perdu ou aider quelqu'un
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              step: 1,
              title: 'Signalez',
              desc: 'Déclarez la perte ou la découverte de votre objet en quelques clics.',
              icon: PlusCircle,
              color: 'bg-primary'
            },
            {
              step: 2,
              title: 'Matchez',
              desc: 'Notre algorithme intelligent trouve les correspondances automatiquement.',
              icon: Zap,
              color: 'bg-accent'
            },
            {
              step: 3,
              title: 'Récupérez',
              desc: 'Contactez la personne et organisez la restitution en toute sécurité.',
              icon: CheckCircle,
              color: 'bg-secondary'
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-100 h-full">
                <div className="flex items-start gap-6">
                  <div className={`h-16 w-16 rounded-2xl ${item.color} flex items-center justify-center shrink-0 shadow-lg`}>
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl font-black text-neutral-200">{item.step}</span>
                      <h3 className="text-xl font-bold text-neutral-900">{item.title}</h3>
                    </div>
                    <p className="text-neutral-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
              {/* Connector Line */}
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-neutral-200" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-neutral-900 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
              Pourquoi TrouvTogo ?
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Une infrastructure fiable et sécurisée pour tous les citoyens togolais
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: 'Matching intelligent',
                desc: 'Algorithme de scoring 0-100 pour des correspondances précises',
                icon: Zap,
              },
              {
                title: 'Géolocalisation',
                desc: 'Carte interactive avec positionnement GPS précis à 5m près',
                icon: MapPin,
              },
              {
                title: 'Messagerie sécurisée',
                desc: 'Contact anonymisé pour protéger vos données personnelles',
                icon: Smartphone,
              },
              {
                title: '100% gratuit',
                desc: 'Service public essentiel, accessible à tous sans frais',
                icon: Shield,
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-neutral-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RECENT LISTINGS */}
      <section className="container mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-neutral-900 mb-2 tracking-tight">
              Derniers signalements
            </h2>
            <p className="text-neutral-500">
              Découvrez les objets perdus et trouvés récemment près de chez vous
            </p>
          </div>
          <Link href="/annonces">
            <Button variant="outline" className="h-12 px-6 font-bold rounded-xl border-2">
              Voir toutes les annonces
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : MOCK_ITEMS.slice(0, 6).map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <AnnonceCard item={item} />
                </motion.div>
              ))}
        </div>
      </section>

      {/* CATEGORIES PREVIEW */}
      <section className="bg-neutral-50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-neutral-900 mb-4 tracking-tight">
              Types d'objets courants
            </h2>
            <p className="text-neutral-500">
              Les catégories les plus fréquemment signalées
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { name: 'Téléphones', count: '450+', icon: Smartphone },
              { name: 'Papiers d\'identité', count: '320+', icon: CreditCard },
              { name: 'Clés', count: '180+', icon: Key },
              { name: 'Bagages', count: '120+', icon: Briefcase },
            ].map((cat, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="h-14 w-14 rounded-xl bg-primary-light flex items-center justify-center mx-auto mb-4">
                  <cat.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold text-neutral-900 mb-1">{cat.name}</h3>
                <p className="text-xs text-neutral-500 font-medium">{cat.count} objets</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="container mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-black text-neutral-900 mb-6 tracking-tight">
            Prêt à retrouver votre objet ?
          </h2>
          <p className="text-lg text-neutral-500 mb-10 max-w-xl mx-auto">
            Rejoignez des milliers de citoyens togolais qui utilisent TrouvTogo 
            pour retrouver leurs objets perdus.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/inscription">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary-dark h-14 px-10 text-base font-bold rounded-xl shadow-xl shadow-primary/20"
              >
                Créer mon compte
              </Button>
            </Link>
            <Link href="/annonces">
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 px-10 text-base font-bold rounded-xl border-2"
              >
                Explorer les annonces
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}