import type { Route } from './+types/home'
import { TaxYearForm } from '../features/tax-year'
import { TaxYearResults } from '~/features/tax-year/components/TaxYearResults'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Tax bracket calculator' },
    { name: 'description', content: 'Tax bracket calculator' },
  ]
}

export default function Home() {
  return (
    <>
      <TaxYearForm />      
      <TaxYearResults />
    </>
  )
}
