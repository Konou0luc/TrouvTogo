// src/app/(public)/inscription/page.tsx
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
import { Mail, Lock, User, Phone, MapPin, Loader2, Search } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { toast } from 'sonner'

const registerSchema = z.object({
  name: z.string().min(2, 'Le nom doit faire au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().regex(/^\+228 \d{2} \d{2} \d{2} \d{2}$/, 'Format: +228 90 00 00 00'),
  city: z.string().min(2, 'La ville est requise'),
  password: z.string().min(6, 'Le mot de passe doit faire au moins 6 caractères'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const setAuth = useAppStore((state) => state.setAuth)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      phone: '+228 ',
    }
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockUser = {
        id: 1,
        name: data.name,
        email: data.email,
        phone: data.phone,
        city: data.city,
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
      toast.success('Compte créé avec succès !')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Une erreur est survenue lors de l\'inscription.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-128px)] bg-neutral-50/50">
      <Card className="w-full max-w-lg shadow-xl border-neutral-200">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Search className="h-7 w-7 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-primary">Créer un compte</CardTitle>
          <CardDescription>
            Rejoignez la communauté TrouvTogo et aidez-nous à retrouver les objets perdus.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input 
                    {...register('name')}
                    placeholder="Nom complet" 
                    className="pl-10 h-12 bg-neutral-50 border-neutral-200"
                    disabled={isLoading}
                  />
                </div>
                {errors.name && <p className="text-[10px] text-danger font-medium ml-1">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input 
                    {...register('phone')}
                    placeholder="+228 90 00 00 00" 
                    className="pl-10 h-12 bg-neutral-50 border-neutral-200"
                    disabled={isLoading}
                  />
                </div>
                {errors.phone && <p className="text-[10px] text-danger font-medium ml-1">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input 
                    {...register('email')}
                    type="email" 
                    placeholder="Email" 
                    className="pl-10 h-12 bg-neutral-50 border-neutral-200"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && <p className="text-[10px] text-danger font-medium ml-1">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input 
                    {...register('city')}
                    placeholder="Ville (ex: Lomé)" 
                    className="pl-10 h-12 bg-neutral-50 border-neutral-200"
                    disabled={isLoading}
                  />
                </div>
                {errors.city && <p className="text-[10px] text-danger font-medium ml-1">{errors.city.message}</p>}
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input 
                    {...register('password')}
                    type="password" 
                    placeholder="Mot de passe" 
                    className="pl-10 h-12 bg-neutral-50 border-neutral-200"
                    disabled={isLoading}
                  />
                </div>
                {errors.password && <p className="text-[10px] text-danger font-medium ml-1">{errors.password.message}</p>}
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input 
                    {...register('confirmPassword')}
                    type="password" 
                    placeholder="Confirmer" 
                    className="pl-10 h-12 bg-neutral-50 border-neutral-200"
                    disabled={isLoading}
                  />
                </div>
                {errors.confirmPassword && <p className="text-[10px] text-danger font-medium ml-1">{errors.confirmPassword.message}</p>}
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
                  Création du compte...
                </>
              ) : (
                'S\'inscrire'
              )}
            </Button>
            <p className="text-sm text-center text-neutral-500">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-primary font-bold hover:underline">
                Se connecter
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
