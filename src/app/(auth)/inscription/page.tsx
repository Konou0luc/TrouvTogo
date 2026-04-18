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
import { Mail, Lock, User, Phone, MapPin, Loader2 } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { toast } from 'sonner'
import { AuthPageShell } from '@/components/auth/AuthPageShell'
import { authToUser, registerRequest } from '@/lib/api'

const registerSchema = z.object({
  name: z.string().min(2, 'Le nom doit faire au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().regex(/^\+228 \d{2} \d{2} \d{2} \d{2}$/, 'Format: +228 90 00 00 00'),
  city: z.string().min(2, 'La ville est requise'),
  password: z.string().min(6, 'Le mot de passe doit faire au moins 6 caractères'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

type RegisterFormValues = z.infer<typeof registerSchema>

const fieldIcon =
  'pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500'
const inputClass =
  'h-10 rounded-xl border-neutral-200 bg-neutral-50/90 pl-10 text-sm text-neutral-900 transition focus:bg-white sm:h-11 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:placeholder:text-neutral-500 focus:dark:bg-neutral-900'

export default function RegisterPage() {
  const router = useRouter()
  const setAuth = useAppStore((state) => state.setAuth)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { phone: '+228 ' },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    try {
      const auth = await registerRequest({
        name: data.name,
        username: data.name.trim(),
        email: data.email,
        password: data.password,
        phone: data.phone,
        city: data.city,
      })
      const user = authToUser(auth, { city: data.city })
      setAuth(user, auth.token, '')
      toast.success('Compte créé avec succès !')
      router.push('/')
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : 'Une erreur est survenue lors de l\'inscription.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthPageShell>
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 backdrop-blur-xl sm:p-6 lg:p-7 dark:border-neutral-800 dark:bg-black">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.35 }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            Rejoindre TrouvTogo
          </p>
          <h1 className="mt-1.5 font-heading text-2xl font-semibold tracking-tight text-neutral-900 sm:text-[1.65rem] sm:leading-snug dark:text-white">
            Créer un compte
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-snug text-neutral-600 dark:text-neutral-300">
            Quelques informations et vous pourrez publier ou suivre des signalements.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1 sm:col-span-2">
              <label htmlFor="name" className="text-xs font-medium text-neutral-800 dark:text-white">
                Nom complet
              </label>
              <div className="relative">
                <User className={fieldIcon} />
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Prénom Nom"
                  className={inputClass}
                  disabled={isLoading}
                />
              </div>
              {errors.name && <p className="text-xs font-medium text-danger">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="phone" className="text-xs font-medium text-neutral-800 dark:text-white">
                Téléphone
              </label>
              <div className="relative">
                <Phone className={fieldIcon} />
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="+228 90 00 00 00"
                  className={inputClass}
                  disabled={isLoading}
                />
              </div>
              {errors.phone && <p className="text-xs font-medium text-danger">{errors.phone.message}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="city" className="text-xs font-medium text-neutral-800 dark:text-white">
                Ville
              </label>
              <div className="relative">
                <MapPin className={fieldIcon} />
                <Input
                  id="city"
                  {...register('city')}
                  placeholder="Lomé"
                  className={inputClass}
                  disabled={isLoading}
                />
              </div>
              {errors.city && <p className="text-xs font-medium text-danger">{errors.city.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="text-xs font-medium text-neutral-800 dark:text-white">
              Email
            </label>
            <div className="relative">
              <Mail className={fieldIcon} />
              <Input
                id="email"
                {...register('email')}
                type="email"
                autoComplete="email"
                placeholder="vous@exemple.com"
                className={inputClass}
                disabled={isLoading}
              />
            </div>
            {errors.email && <p className="text-xs font-medium text-danger">{errors.email.message}</p>}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="password" className="text-xs font-medium text-neutral-800 dark:text-white">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className={fieldIcon} />
                <Input
                  id="password"
                  {...register('password')}
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className={inputClass}
                  disabled={isLoading}
                />
              </div>
              {errors.password && <p className="text-xs font-medium text-danger">{errors.password.message}</p>}
            </div>
            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="text-xs font-medium text-neutral-800 dark:text-white">
                Confirmation
              </label>
              <div className="relative">
                <Lock className={fieldIcon} />
                <Input
                  id="confirmPassword"
                  {...register('confirmPassword')}
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className={inputClass}
                  disabled={isLoading}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs font-medium text-danger">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="mt-1 h-10 w-full rounded-xl bg-[#2c2c2a] text-sm font-semibold text-white transition hover:bg-primary sm:h-11 dark:bg-primary dark:hover:bg-primary/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création…
              </>
            ) : (
              'S\'inscrire'
            )}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-neutral-600 dark:text-neutral-300">
          Déjà inscrit ?{' '}
          <Link
            href="/login"
            className="font-semibold text-primary underline-offset-4 transition hover:text-primary-dark hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </AuthPageShell>
  )
}
