'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AdminButton from '@/components/admin/AdminButton'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { fetchCategories, updateCategory } from '@/lib/api'
import { toast } from 'sonner'
import Breadcrumb from '@/components/layout/Breadcrumb'
import { ArrowLeft, Loader2 } from 'lucide-react'
import type { BackendCategorie } from '@/lib/backend-types'

export default function EditerCategoriePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [category, setCategory] = useState<BackendCategorie | null>(null)
  const [nom, setNom] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const cats = await fetchCategories()
        const cat = cats.find(c => c.id === Number(id))
        if (cat) {
          setCategory(cat)
          setNom(cat.nom)
          setDescription(cat.description ?? '')
        } else {
          toast.error('Catégorie non trouvée')
          router.push('/admin/categories')
        }
      } catch (err) {
        toast.error('Erreur lors du chargement')
        router.push('/admin/categories')
      } finally {
        setLoading(false)
      }
    }

    loadCategory()
  }, [id, router])

  const handleSave = async () => {
    if (!nom.trim()) {
      toast.error('Le nom est requis')
      return
    }
    if (!category) return

    setSaving(true)
    try {
      await updateCategory(category.id, { nom: nom.trim(), description })
      toast.success('Catégorie modifiée')
      router.push('/admin/categories')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!category) {
    return null
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-10 lg:py-12">
        <Breadcrumb
          items={[
            { label: 'Administration', href: '/admin/dashboard' },
            { label: 'Catégories', href: '/admin/categories' },
            { label: `Modifier ${category.nom}` },
          ]}
        />

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <AdminButton variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </AdminButton>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Modifier la catégorie</h1>
              <p className="text-sm text-muted-foreground mt-1">{category.nom}</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Détails de la catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nom</label>
                <Input
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Ex: Téléphones"
                  className="h-10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Description (optionnel)</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez cette catégorie..."
                  rows={4}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <AdminButton variant="outline" onClick={() => router.back()}>
                  Annuler
                </AdminButton>
                <AdminButton onClick={handleSave} disabled={saving}>
                  {saving ? 'Enregistrement en cours...' : 'Sauvegarder'}
                </AdminButton>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
