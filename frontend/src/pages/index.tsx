import { Button } from '@/components/ui/button'
import { TypographyH1, TypographyH3 } from '@/components/ui/typography'
import { Noto_Sans } from 'next/font/google'

const notoSans = Noto_Sans({
  weight: ['400', '500', '600', '700', '800', '900'],
  preload: false
})

export default function Home() {
  return (
    <main
      className={`p-24 ${notoSans.className}`}
    >
      <TypographyH1>Elevate your technical interview prep.</TypographyH1>
      <TypographyH3>Crush technical interviews by polishing your skills with friends.</TypographyH3>
      <Button>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
        </svg>
        Sign In with GitHub
      </Button>
    </main>
  )
}
