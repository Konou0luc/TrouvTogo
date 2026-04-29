'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AdminButton from '@/components/admin/AdminButton'
import { fetchCategories, deleteCategory, fetchObjetsPage } from '@/lib/api'
import { toast } from 'sonner'
import Breadcrumb from '@/components/layout/Breadcrumb'
import { ArrowLeft, Loader2, Edit, Trash } from 'lucide-react'
import type { BackendCategorie } from '@/lib/backend-types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

export default function CategoryDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [category, setCategory] = useState<BackendCategorie | null>(null)
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState<number | null>(null)
  const [countLoading, setCountLoading] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const cats = await fetchCategories()
        const cat = cats.find(c => c.id === Number(id))
        if (cat) {
          setCategory(cat)
          // Load count
          setCountLoading(true)
          try {
            const res = await fetchObjetsPage({ page: 0, size: 1, categorieId: cat.id })
            setCount(res.pagination.total)
          } catch (e) {
            setCount(null)
          } finally {
            setCountLoading(false)
          }
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

  const handleDelete = async () => {
    if (!category) return
    setDeleting(true)
    try {
      await deleteCategory(category.id)
      toast.success('Catégorie supprimée')
      router.push('/admin/categories')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la suppression')
    } finally {
      setDeleting(false)
      setDeleteConfirmOpen(false)
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
            { label: category.nom },
          ]}
        />

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <AdminButton variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </AdminButton>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{category.nom}</h1>
              <p className="text-sm text-muted-foreground mt-1">ID: {category.id}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Nom</label>
                  <p className="text-base font-medium text-foreground">{category.nom}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
                  <p className="text-base text-foreground">{category.description ?? '—'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Nombre d'annonces</label>
                  <div className="flex items-center gap-2">
                    {countLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <p className="text-base font-medium text-foreground">{count ?? '—'}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <AdminButton onClick={() => router.push(`/admin/categories/${category.id}`)}>
                  <Edit className="h-4 w-4" />
                  Modifier
                </AdminButton>
                <AdminButton variant="destructive" onClick={() => setDeleteConfirmOpen(true)}>
                  <Trash className="h-4 w-4" />
                  Supprimer
                </AdminButton>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer la catégorie</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer la catégorie "{category.nom}" ?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Cette action est irréversible.</p>
            {count && count > 0 && (
              <p className="text-amber-600">⚠️ Cette catégorie contient {count} annonce{count > 1 ? 's' : ''}.</p>
            )}
          </div>

          <DialogFooter>
            <AdminButton variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Annuler
            </AdminButton>
            <AdminButton variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Suppression...' : 'Supprimer'}
            </AdminButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
