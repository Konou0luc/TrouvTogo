// src/app/(public)/login/page.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Lock, Loader2, Search } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { toast } from 'sonner'

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit faire au moins 6 caractères'),
  rememberMe: z.boolean().optional(),
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
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockUser = {
        id: 1,
        name: 'Koffi Togo',
        email: data.email,
        phone: '+228 90 00 00 00',
        city: 'Lomé',
        avatar: null,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        stats: {
          totalItems: 0,
          itemsFound: 0,
          itemsReturned: 0,
          activeItems: 0,
          pendingMatches: 0
        }
      }
      
      setAuth(mockUser, 'fake-jwt-token', 'fake-refresh-token')
      toast.success('Connexion réussie !')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Erreur de connexion. Veuillez vérifier vos identifiants.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-[calc(100vh-128px)] bg-neutral-50/50">
      <Card className="w-full max-w-md shadow-xl border-neutral-200">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Search className="h-7 w-7 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-primary">Bon retour !</CardTitle>
          <CardDescription>
            Connectez-vous pour gérer vos annonces et voir vos matchs.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input 
                  {...register('email')}
                  type="email" 
                  placeholder="Email" 
                  className="pl-10 h-12 bg-neutral-50 border-neutral-200 focus:bg-white transition-all"
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="text-xs text-danger font-medium ml-1">{errors.email.message}</p>}
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input 
                  {...register('password')}
                  type="password" 
                  placeholder="Mot de passe" 
                  className="pl-10 h-12 bg-neutral-50 border-neutral-200 focus:bg-white transition-all"
                  disabled={isLoading}
                />
              </div>
              {errors.password && <p className="text-xs text-danger font-medium ml-1">{errors.password.message}</p>}
              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 mt-2">
            <Button 
              type="submit" 
              className="w-full h-12 bg-primary hover:bg-primary-dark font-bold text-lg rounded-xl shadow-lg shadow-primary/10" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
            <p className="text-sm text-center text-neutral-500">
              Pas encore de compte ?{' '}
              <Link href="/inscription" className="text-primary font-bold hover:underline">
                S'inscrire gratuitement
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
