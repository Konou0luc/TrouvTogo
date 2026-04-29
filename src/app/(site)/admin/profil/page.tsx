'use client'

import { useAppStore } from '@/store/useAppStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Breadcrumb from '@/components/layout/Breadcrumb'
import { Mail, User, Calendar, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminProfilPage() {
  const user = useAppStore((s) => s.user)

  if (!user) {
    return <div className="text-center py-12">Utilisateur non trouvé</div>
  }

  const joinDate = new Date(user.createdAt || Date.now()).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-10 py-8">
        <Breadcrumb
          items={[
            { label: 'Administration', href: '/admin/dashboard' },
            { label: 'Mon Profil' },
          ]}
        />

        <div className="mt-8 mb-8">
          <h1 className="text-3xl font-bold text-foreground">Mon Profil</h1>
          <p className="text-muted-foreground mt-2">Gérez vos informations de profil</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Carte profil principal */}
          <Card className="lg:col-span-1 border-border bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Informations de profil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 border-2 border-border mb-4">
                  <AvatarImage src={user.avatar || ''} alt={user.name} />
                  <AvatarFallback className="bg-primary text-lg font-semibold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                <div className="flex items-center gap-2 mt-2 bg-primary/10 px-3 py-1 rounded-full">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Administrateur</span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium text-foreground break-all">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Membre depuis</p>
                    <p className="text-sm font-medium text-foreground">{joinDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Rôle</p>
                    <p className="text-sm font-medium text-primary">Admin</p>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-6">Modifier le profil</Button>
            </CardContent>
          </Card>

          {/* Statistiques et actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats admin */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Activité administrative</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background p-4 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Modérations effectuées</p>
                    <p className="text-2xl font-bold text-foreground">--</p>
                  </div>
                  <div className="bg-background p-4 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Signalements résolus</p>
                    <p className="text-2xl font-bold text-foreground">--</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Préférences */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Préférences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                  <div>
                    <p className="font-medium text-foreground">Notifications par email</p>
                    <p className="text-sm text-muted-foreground">Recevoir des alertes importantes</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                  <div>
                    <p className="font-medium text-foreground">Logs détaillés</p>
                    <p className="text-sm text-muted-foreground">Enregistrer toutes les actions</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            {/* Actions de sécurité */}
            <Card className="border-border bg-card border-danger/20">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-foreground">Sécurité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  Changer le mot de passe
                </Button>
                <Button variant="outline" className="w-full">
                  Voir les sessions actives
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
