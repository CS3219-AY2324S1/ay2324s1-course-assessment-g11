import { Button } from '@/components/ui/button'
import Spotlight, { SpotlightCard } from '@/components/ui/spotlight'
import { TypographyH1, TypographyH3 } from '@/components/ui/typography'
import { Noto_Sans } from 'next/font/google'
import Image from 'next/image'
import { AiFillGithub } from 'react-icons/ai'

const notoSans = Noto_Sans({
  weight: ['400', '500', '600', '700', '800', '900'],
  preload: false
})

export default function Home() {
  return (
    <main
      className={`${notoSans.className}`}
    >
      <Spotlight className="group">
        <SpotlightCard>
          <div className="p-24 mt-12 flex flex-col items-center justify-center text-center">
            <TypographyH1 className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4">Elevate your technical interview prep.</TypographyH1>
            <TypographyH3 className="text-foreground mb-8">Crush technical interviews by polishing your skills with friends.</TypographyH3>
            <Button className="mb-16">
              <AiFillGithub className="mr-2 w-6 h-6" />
              Sign up with GitHub
            </Button>
            <Image src={'/hero-image.jpeg'} width={800} height={600} alt="Screenshot of the collaboration feature" className="shadow-2xl shadow-secondary/20 shadow-ring-10"/>
          </div>
        </SpotlightCard>
      </Spotlight>
    </main>
  )
}
