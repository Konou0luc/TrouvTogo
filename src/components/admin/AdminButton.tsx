import { Button } from '@/components/ui/button'
import type { ComponentProps } from 'react'

export default function AdminButton(props: ComponentProps<typeof Button>) {
  // Default to a slightly larger button for admin pages
  return <Button size={props.size ?? 'lg'} {...props} />
}
