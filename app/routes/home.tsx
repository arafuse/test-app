import type { Route } from './+types/home'
import { TaxYearForm } from '../features/tax-year'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Tax bracket calculator' },
    { name: 'description', content: 'Tax bracket calculator' },
  ]
}

export default function Home() {
  return <TaxYearForm />
}
