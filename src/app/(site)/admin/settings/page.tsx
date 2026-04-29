'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Breadcrumb from '@/components/layout/Breadcrumb'
import { Bell, Lock, Database, FileText, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    moderationAlerts: true,
    logAllActions: true,
    dataRetention: '90',
    maintenanceMode: false,
  })

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: typeof prev[key] === 'boolean' ? !prev[key] : prev[key],
    }))
  }

  const handleSave = () => {
    toast.success('Paramètres sauvegardés avec succès')
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-10 py-8">
        <Breadcrumb
          items={[
            { label: 'Administration', href: '/admin/dashboard' },
            { label: 'Paramètres' },
          ]}
        />

        <div className="mt-8 mb-8">
          <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
          <p className="text-muted-foreground mt-2">Configurez les paramètres de l'administration</p>
        </div>

        <div className="space-y-6">
          {/* Notifications */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Notifications</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border hover:border-primary/50 transition-colors">
                <div>
                  <p className="font-medium text-foreground">Notifications par email</p>
                  <p className="text-sm text-muted-foreground">Recevoir des alertes par email</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={() => handleToggle('emailNotifications')}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border hover:border-primary/50 transition-colors">
                <div>
                  <p className="font-medium text-foreground">Alertes de modération</p>
                  <p className="text-sm text-muted-foreground">Être alerté des nouveaux signalements</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.moderationAlerts}
                  onChange={() => handleToggle('moderationAlerts')}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border hover:border-primary/50 transition-colors">
                <div>
                  <p className="font-medium text-foreground">Notifications SMS</p>
                  <p className="text-sm text-muted-foreground">Recevoir des alertes par SMS</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.smsNotifications}
                  onChange={() => handleToggle('smsNotifications')}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>

          {/* Logs et sécurité */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Logs et audit</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border hover:border-primary/50 transition-colors">
                <div>
                  <p className="font-medium text-foreground">Enregistrer toutes les actions</p>
                  <p className="text-sm text-muted-foreground">Historique complet des actions admin</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.logAllActions}
                  onChange={() => handleToggle('logAllActions')}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-lg bg-background border border-border">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Rétention des données (jours)
                </label>
                <select
                  value={settings.dataRetention}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      dataRetention: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-md bg-card border border-border text-foreground"
                >
                  <option value="30">30 jours</option>
                  <option value="90">90 jours</option>
                  <option value="180">180 jours</option>
                  <option value="365">1 an</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Système */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Système</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-danger/20 hover:border-danger/40 transition-colors">
                <div>
                  <p className="font-medium text-foreground">Mode maintenance</p>
                  <p className="text-sm text-muted-foreground">Désactiver l'accès utilisateur temporairement</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={() => handleToggle('maintenanceMode')}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-lg bg-background border border-border space-y-3">
                <p className="font-medium text-foreground flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Maintenance de la base de données
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Optimiser les index
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Nettoyer les caches
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="border-border bg-card border-danger/20">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-danger" />
                <CardTitle className="text-lg">Zone de danger</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Les actions suivantes sont irréversibles et doivent être effectuées avec prudence.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  Réinitialiser les caches
                </Button>
                <Button variant="destructive" className="flex-1">
                  Exporter les données
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bouton de sauvegarde */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} className="flex-1">
              Sauvegarder les paramètres
            </Button>
            <Button variant="outline" className="flex-1">
              Annuler
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
