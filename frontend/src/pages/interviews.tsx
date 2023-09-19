import { TypographyBodyHeavy, TypographyH1 } from '@/components/ui/typography'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Interviews() {
  return (
    <div className='min-h-screen p-12'>
      <TypographyH1 className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary w-min mb-1">Interviews</TypographyH1>
      <TypographyBodyHeavy>Try out mock interviews with your peers!</TypographyBodyHeavy>
      <Link href="/room"><Button variant={"outline"}>Practice with a peer!</Button></Link>
    </div>
  )
}
