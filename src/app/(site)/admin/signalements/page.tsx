// src/app/(site)/admin/signalements/page.tsx
"use client"

import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { fetchAdminUnresolvedSignalements, resolveSignalement } from '@/lib/api'
import { BackendSignalement } from '@/lib/backend-types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import AdminButton from '@/components/admin/AdminButton'
import ResolveSignalementConfirmModal from '@/components/admin/ResolveSignalementConfirmModal'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Eye, User, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toast } from 'sonner'
import Breadcrumb from '@/components/layout/Breadcrumb'

export default function AdminSignalementsPage() {
  const [reports, setReports] = useState<BackendSignalement[]>([])
  const [loading, setLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [reportToResolve, setReportToResolve] = useState<BackendSignalement | null>(null)
  const [resolving, setResolving] = useState(false)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchAdminUnresolvedSignalements()
      .then((r) => {
        if (!mounted) return
        setReports(r)
      })
      .catch((err) => {
        console.error('Failed to fetch reports', err)
        toast.error('Impossible de charger les signalements')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  const openConfirm = useCallback((report: BackendSignalement) => {
    setReportToResolve(report)
    setConfirmOpen(true)
  }, [])

  const confirmResolve = async () => {
    if (!reportToResolve) return
    setResolving(true)
    try {
      await resolveSignalement(reportToResolve.id)
      setReports((prev) => prev.filter((r) => r.id !== reportToResolve.id))
      toast.success('Signalement résolu')
      setConfirmOpen(false)
      setReportToResolve(null)
    } catch (err) {
      console.error('Failed to resolve report', err)
      toast.error('Erreur lors de la résolution du signalement')
    } finally {
      setResolving(false)
    }
  }

  return (
    <div className="container py-6">
      <Breadcrumb items={[{ label: 'Administration', href: '/admin/dashboard' }, { label: 'Signalements' }]} />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Signalements</h1>
        <Badge>{reports.length}</Badge>
      </div>

      <div className="grid gap-4">
        {reports.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center text-muted-foreground">Aucun signalement non-résolu</CardContent>
          </Card>
        ) : (
          reports.map((report) => (
            <Card key={report.id} className="bg-card border-border">
              <CardHeader className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">{report.objetTitre || `Annonce #${report.objetId}`}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{report.message ?? '—'}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{report.reporterUsername}</span>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(report.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <Link href={`/annonces/${report.objetId}`} className="text-sm text-foreground hover:underline flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Voir l'annonce
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <AdminButton size="sm" className="bg-secondary hover:bg-secondary-dark gap-2" onClick={() => openConfirm(report)}>
                    <CheckCircle2 className="h-4 w-4" />
                    Résoudre
                  </AdminButton>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <ResolveSignalementConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={confirmResolve}
        loading={resolving}
        titre={reportToResolve?.objetTitre}
      />
    </div>
  )
}
