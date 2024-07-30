import dynamic from 'next/dynamic'

const ClientGPAcalculator = dynamic(() => import('./GPACalculator'), { ssr: false })

export default function GPAcalculator() {
  return <ClientGPAcalculator />
}