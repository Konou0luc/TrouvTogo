'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { AuthPageShell } from '@/components/auth/AuthPageShell'

const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1200))
      toast.success('Si un compte existe, un email vient de partir.')
      setIsSubmitted(true)
    } catch {
      toast.error('Impossible d’envoyer l’email pour le moment.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <AuthPageShell>
        <div className="rounded-2xl border border-border bg-card p-10 backdrop-blur-xl sm:p-12 lg:p-14 dark:border-neutral-800 dark:bg-card">
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <CheckCircle2 className="h-10 w-10" />
            </div>
          </div>
          <h1 className="mt-8 text-center font-heading text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
            Vérifiez votre boîte mail
          </h1>
          <p className="mt-4 text-center text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
            Si un compte correspond à cette adresse, vous y trouverez un lien pour réinitialiser votre mot de passe.
          </p>
          <div className="mt-10 flex flex-col gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-14 rounded-2xl border-neutral-200 text-base dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
              onClick={() => setIsSubmitted(false)}
            >
              Utiliser une autre adresse
            </Button>
            <Link href="/login" className="w-full">
              <Button variant="ghost" className="h-14 w-full rounded-2xl text-base text-neutral-600 dark:text-neutral-300">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Retour à la connexion
              </Button>
            </Link>
          </div>
        </div>
      </AuthPageShell>
    )
  }

  return (
    <AuthPageShell>
      <div className="rounded-2xl border border-neutral-200 bg-card p-10 backdrop-blur-xl sm:p-12 lg:p-14">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.35 }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Assistance
          </p>
          <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-neutral-900 sm:text-[2.75rem] sm:leading-tight dark:text-white">
            Mot de passe oublié
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
            Indiquez l’email de votre compte : nous vous enverrons un lien sécurisé.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
          <div className="space-y-2.5">
            <label htmlFor="email" className="text-sm font-medium text-neutral-800 dark:text-white">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
              <Input
                id="email"
                {...register('email')}
                type="email"
                autoComplete="email"
                placeholder="vous@exemple.com"
                className="h-14 rounded-2xl border-border bg-card/90 dark:bg-card pl-12 text-base text-foreground placeholder:text-muted-foreground transition focus:bg-card"
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-sm font-medium text-danger">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="h-14 w-full rounded-2xl bg-[#2c2c2a] text-base font-semibold text-white transition hover:bg-primary dark:bg-primary dark:hover:bg-primary/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Envoi…
              </>
            ) : (
              'Envoyer le lien'
            )}
          </Button>
        </form>

        <Link
          href="/login"
          className="mt-10 flex items-center justify-center gap-2 text-base font-semibold text-neutral-600 transition hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          Retour à la connexion
        </Link>
      </div>
    </AuthPageShell>
  )
}
