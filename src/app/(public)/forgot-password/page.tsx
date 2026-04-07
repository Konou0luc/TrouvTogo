// src/app/(public)/forgot-password/page.tsx
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
import { Mail, ArrowLeft, Loader2, Search, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true)
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Email de réinitialisation envoyé !')
      setIsSubmitted(true)
    } catch (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-[calc(100vh-128px)] bg-neutral-50/50">
        <Card className="w-full max-w-md shadow-xl border-neutral-200">
          <CardHeader className="space-y-1 text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-secondary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-neutral-900">Email envoyé !</CardTitle>
            <CardDescription>
              Si un compte existe avec cette adresse, vous recevrez un lien de réinitialisation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-neutral-50 rounded-xl p-4 text-center">
              <p className="text-sm text-neutral-600">
                Vérifiez votre boîte mail et cliquez sur le lien pour réinitialiser votre mot de passe.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              variant="outline" 
              className="w-full h-12 font-bold rounded-xl"
              onClick={() => setIsSubmitted(false)}
            >
              Réessayer
            </Button>
            <Link href="/login" className="w-full">
              <Button variant="ghost" className="w-full h-12 text-neutral-500">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la connexion
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
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
          <CardTitle className="text-2xl font-bold tracking-tight text-neutral-900">Mot de passe oublié ?</CardTitle>
          <CardDescription>
            Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
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
                  placeholder="Votre email" 
                  className="pl-10 h-12 bg-neutral-50 border-neutral-200 focus:bg-white transition-all"
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="text-xs text-danger font-medium ml-1">{errors.email.message}</p>}
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
                  Envoi en cours...
                </>
              ) : (
                'Envoyer le lien'
              )}
            </Button>
            <Link href="/login" className="w-full">
              <Button variant="ghost" className="w-full h-12 text-neutral-500">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la connexion
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}