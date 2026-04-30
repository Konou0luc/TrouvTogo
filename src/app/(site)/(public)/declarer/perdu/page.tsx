// src/app/(public)/declarer/perdu/page.tsx
import DeclarerForm from '@/components/forms/DeclarerForm'

export default function DeclarerPerduPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-primary mb-2">J'ai perdu un objet</h1>
          <p className="text-muted-foreground">Remplissez le formulaire pour lancer le matching intelligent.</p>
        </div>
        <DeclarerForm type="LOST" />
      </div>
    </div>
  )
}
