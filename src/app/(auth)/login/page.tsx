'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Lock, Loader2 } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { toast } from 'sonner'
import { AuthPageShell } from '@/components/auth/AuthPageShell'
import { authToUser, loginRequest } from '@/lib/api'

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit faire au moins 6 caractères'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAppStore((state) => state.setAuth)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    try {
      const auth = await loginRequest({
        email: data.email,
        password: data.password,
      })
      const user = authToUser(auth)
      setAuth(user, auth.token, '')
      toast.success('Connexion réussie !')
      const params = new URLSearchParams(
        typeof window !== 'undefined' ? window.location.search : ''
      )
      const redirectParam = params.get('redirect')
      const defaultDest = user.role === 'ADMIN' ? '/admin/dashboard' : '/'
      router.push(redirectParam && redirectParam.startsWith('/') ? redirectParam : defaultDest)
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : 'Erreur de connexion. Vérifiez vos identifiants.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthPageShell>
      <div className="rounded-2xl border border-neutral-200 bg-white p-10 backdrop-blur-xl sm:p-12 lg:p-14 dark:border-neutral-800 dark:bg-black">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.35 }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Bienvenue
          </p>
          <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-neutral-900 sm:text-[2.75rem] sm:leading-tight dark:text-white">
            Connexion
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
            Accédez à vos annonces, matchs et messages — tout au même endroit.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
          <div className="space-y-2.5">
            <label htmlFor="email" className="text-sm font-medium text-neutral-800 dark:text-white">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
              <Input
                id="email"
                {...register('email')}
                type="email"
                autoComplete="email"
                placeholder="vous@exemple.com"
                className="h-14 rounded-2xl border-neutral-200 bg-neutral-50/90 pl-12 text-base text-neutral-900 transition focus:bg-white dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:placeholder:text-neutral-500 focus:dark:bg-neutral-900"
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-sm font-medium text-danger">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="password" className="text-sm font-medium text-neutral-800 dark:text-white">
                Mot de passe
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-semibold text-primary transition hover:text-primary-dark"
              >
                Oublié ?
              </Link>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
              <Input
                id="password"
                {...register('password')}
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="h-14 rounded-2xl border-neutral-200 bg-neutral-50/90 pl-12 text-base text-neutral-900 transition focus:bg-white dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:placeholder:text-neutral-500 focus:dark:bg-neutral-900"
                disabled={isLoading}
              />
            </div>
            {errors.password && (
              <p className="text-sm font-medium text-danger">{errors.password.message}</p>
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
                Connexion…
              </>
            ) : (
              'Se connecter'
            )}
          </Button>
        </form>

        <p className="mt-10 text-center text-base text-neutral-600 dark:text-neutral-300">
          Pas encore de compte ?{' '}
          <Link
            href="/inscription"
            className="font-semibold text-primary underline-offset-4 transition hover:text-primary-dark hover:underline"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </AuthPageShell>
  )
}
