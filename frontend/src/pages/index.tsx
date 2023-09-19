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
      className={`p-24 ${notoSans.className} flex flex-col items-center justify-center min-h-screen text-center`}
    >
      <TypographyH1>Elevate your technical interview prep.</TypographyH1>
      <TypographyH3 >Crush technical interviews by polishing your skills with friends.</TypographyH3>
      <Button className="my-4">
        <AiFillGithub className="mr-2 w-6 h-6" />
        Sign In with GitHub
      </Button>
    </main>
  )
}
