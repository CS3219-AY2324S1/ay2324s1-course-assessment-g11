import { Button } from '@/components/ui/button'
import { TypographyH1, TypographyH3 } from '@/components/ui/typography'
import { Noto_Sans } from 'next/font/google'
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
      <div className="h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center">
        <TypographyH1 className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Elevate your technical interview prep.</TypographyH1>
        <TypographyH3 className="text-foreground">Crush technical interviews by polishing your skills with friends.</TypographyH3>
        <Button className="my-4">
          <AiFillGithub className="mr-2 w-6 h-6" />
          Sign up with GitHub
        </Button>
      </div>
    </main>
  )
}
