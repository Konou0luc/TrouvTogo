// src/app/(public)/declarer/trouve/page.tsx
import DeclarerForm from '@/components/forms/DeclarerForm'

export default function DeclarerTrouvePage() {
  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-secondary mb-2">J'ai trouvé un objet</h1>
          <p className="text-neutral-500">Aidez quelqu'un à retrouver son bien précieux.</p>
        </div>
        <DeclarerForm type="FOUND" />
      </div>
    </div>
  )
}
