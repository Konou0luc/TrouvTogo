// src/components/forms/DeclarerForm.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { 
  Laptop, 
  CreditCard, 
  Key, 
  Briefcase, 
  Shirt, 
  Wallet, 
  Smartphone, 
  Gem, 
  BookOpen, 
  PawPrint, 
  Package,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Upload,
  X,
  MapPin,
  Calendar as CalendarIcon,
  Loader2
} from 'lucide-react'
import { ItemCategory, ItemType } from '@/types'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const LocationPicker = dynamic(() => import('@/components/map/LocationPicker'), { ssr: false })

const formSchema = z.object({
  type: z.enum(['LOST', 'FOUND']),
  category: z.string().min(1, 'La catégorie est requise'),
  title: z.string().min(5, 'Le titre doit faire au moins 5 caractères'),
  description: z.string().min(20, 'La description doit faire au moins 20 caractères'),
  reward: z.string().optional(),
  date: z.string().min(1, 'La date est requise'),
  district: z.string().min(1, 'Le quartier est requis'),
  city: z.string().min(1, 'La ville est requise'),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().optional(),
  depositLocation: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

const categories: { id: ItemCategory; label: string; icon: any }[] = [
  { id: 'PHONE', label: 'Téléphone', icon: Smartphone },
  { id: 'IDENTITY_PAPERS', label: 'Papiers', icon: CreditCard },
  { id: 'KEYS', label: 'Clés', icon: Key },
  { id: 'LUGGAGE', label: 'Bagages', icon: Briefcase },
  { id: 'WALLET', label: 'Portefeuille', icon: Wallet },
  { id: 'ELECTRONICS', label: 'Électronique', icon: Laptop },
  { id: 'JEWELRY', label: 'Bijoux', icon: Gem },
  { id: 'CLOTHING', label: 'Vêtements', icon: Shirt },
  { id: 'PETS', label: 'Animaux', icon: PawPrint },
  { id: 'BOOKS', label: 'Livres', icon: BookOpen },
  { id: 'OTHER', label: 'Autre', icon: Package },
]

export default function DeclarerForm({ type }: { type: ItemType }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [images, setImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, watch, setValue, formState: { errors, isValid } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type,
      category: '',
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      city: 'Lomé',
      latitude: 6.1375,
      longitude: 1.2123,
    }
  })

  const currentCategory = watch('category')
  const currentTitle = watch('title')
  const currentDesc = watch('description')
  const currentDistrict = watch('district')
  const currentCity = watch('city')
  const currentDate = watch('date')
  const currentLat = watch('latitude')
  const currentLng = watch('longitude')

  const nextStep = () => {
    if (step === 1 && !currentCategory) return toast.error('Veuillez choisir une catégorie')
    if (step === 2 && (!currentTitle || currentDesc.length < 20)) return toast.error('Veuillez remplir le titre et la description')
    if (step === 3 && !currentDistrict) return toast.error('Veuillez indiquer le lieu')
    setStep(s => s + 1)
  }

  const prevStep = () => setStep(s => s - 1)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setImages(prev => [...prev, ...newFiles].slice(0, 5))
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Annonce publiée avec succès !')
      router.push('/annonces')
    } catch (error) {
      toast.error('Une erreur est survenue.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between mb-4">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className="flex flex-col items-center">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step >= s ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-neutral-100 text-neutral-400'
              }`}>
                {step > s ? <CheckCircle2 className="h-6 w-6" /> : s}
              </div>
              <span className={`text-xs mt-2 font-medium ${step >= s ? 'text-primary' : 'text-neutral-400'}`}>
                {s === 1 ? 'Catégorie' : s === 2 ? 'Infos' : s === 3 ? 'Lieu' : 'Confirmer'}
              </span>
            </div>
          ))}
        </div>
        <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300" 
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Step 1: Category */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-6 text-center">Choisissez une catégorie</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Card 
                  key={cat.id}
                  onClick={() => setValue('category', cat.id)}
                  className={`p-6 cursor-pointer hover:shadow-md transition-all flex flex-col items-center text-center gap-3 border-2 ${
                    currentCategory === cat.id ? 'border-primary bg-primary-light/30' : 'border-transparent'
                  }`}
                >
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                    currentCategory === cat.id ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    <cat.icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-bold">{cat.label}</span>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Description & Images */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-2xl font-bold mb-2">Description de l'objet</h2>
              <p className="text-neutral-500 text-sm mb-6">Donnez un maximum de détails pour faciliter le matching.</p>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Titre de l'annonce *</label>
                  <Input 
                    {...register('title')}
                    placeholder="Ex: iPhone 13 Pro bleu écran fissuré" 
                    className="h-12 bg-neutral-50 border-neutral-200"
                  />
                  {errors.title && <p className="text-xs text-danger">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold">Description détaillée *</label>
                  <Textarea 
                    {...register('description')}
                    placeholder="Détaillez les signes distinctifs (marque, couleur, coque, fond d'écran...)"
                    className="min-h-[150px] bg-neutral-50 border-neutral-200"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400">
                    <span>{currentDesc.length} / 2000 caractères</span>
                    {errors.description && <span className="text-danger font-bold">{errors.description.message}</span>}
                  </div>
                </div>

                {type === 'LOST' && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Récompense (optionnel)</label>
                    <Input 
                      {...register('reward')}
                      placeholder="Ex: 5000 FCFA, Un grand merci..." 
                      className="h-12 bg-neutral-50 border-neutral-200"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <label className="text-sm font-bold">Photos (max 5)</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                    {images.map((file, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden border">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                        <button 
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 h-5 w-5 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {images.length < 5 && (
                      <label className="aspect-square rounded-xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-neutral-50 transition-colors">
                        <Upload className="h-6 w-6 text-neutral-400" />
                        <span className="text-[10px] font-medium text-neutral-500">Ajouter</span>
                        <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageChange} />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Location & Date */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-2xl font-bold mb-2">Lieu et date</h2>
              <p className="text-neutral-500 text-sm mb-6">Où et quand l'objet a-t-il été {type === 'LOST' ? 'perdu' : 'trouvé'} ?</p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Quartier / District *</label>
                  <Input 
                    {...register('district')}
                    placeholder="Ex: Bè, Agoè, Adidogomé..." 
                    className="h-12 bg-neutral-50 border-neutral-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Date *</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input 
                      {...register('date')}
                      type="date"
                      className="pl-10 h-12 bg-neutral-50 border-neutral-200"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <label className="text-sm font-bold">Position précise sur la carte *</label>
                <div className="h-[400px] rounded-2xl overflow-hidden border-2 border-neutral-200 relative">
                  <LocationPicker 
                    initialLocation={{ lat: currentLat, lng: currentLng }} 
                    onChange={(lat, lng) => {
                      setValue('latitude', lat)
                      setValue('longitude', lng)
                    }} 
                  />
                </div>
              </div>

              {type === 'FOUND' && (
                <div className="space-y-2">
                  <label className="text-sm font-bold">Lieu de dépôt (Où est l'objet ?)</label>
                  <Input 
                    {...register('depositLocation')}
                    placeholder="Ex: Commissariat de Bè, Je l'ai avec moi..." 
                    className="h-12 bg-neutral-50 border-neutral-200"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <div className="h-16 w-16 bg-secondary-light text-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Vérification finale</h2>
              <p className="text-neutral-500 text-sm">Veuillez relire vos informations avant de publier.</p>
            </div>

            <Card className="p-6 bg-white border-neutral-100 shadow-sm space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Titre</span>
                    <p className="font-bold text-lg">{currentTitle}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Catégorie</span>
                    <p className="font-medium">{categories.find(c => c.id === currentCategory)?.label}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Description</span>
                    <p className="text-sm text-neutral-600 leading-relaxed line-clamp-3">{currentDesc}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Lieu</span>
                      <p className="text-sm font-bold">{currentDistrict}, {currentCity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Date</span>
                      <p className="text-sm font-bold">{format(new Date(currentDate), 'PPPP', { locale: fr })}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="p-4 rounded-xl bg-primary-light/30 border border-primary/10">
              <p className="text-xs text-primary-dark leading-relaxed">
                En publiant cette annonce, vous acceptez nos CGU. Notre algorithme lancera immédiatement 
                une recherche pour trouver des correspondances potentielles.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-8 border-t">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={prevStep} className="h-12 px-8 rounded-xl">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Précédent
            </Button>
          ) : <div />}

          {step < 4 ? (
            <Button type="button" onClick={nextStep} className="h-12 px-8 rounded-xl bg-primary hover:bg-primary-dark">
              Suivant
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              type="submit" 
              className="h-12 px-12 rounded-xl bg-secondary hover:bg-secondary-dark font-bold text-lg shadow-lg shadow-secondary/20"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Publication...
                </>
              ) : (
                'Publier l\'annonce'
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
