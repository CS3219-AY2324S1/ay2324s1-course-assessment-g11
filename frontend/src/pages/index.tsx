import { Noto_Sans } from 'next/font/google'

const notoSans = Noto_Sans({ 
  weight: '400', 
  preload: false 
})

export default function Home() {
  return (
    <main
      className={`p-24 ${notoSans.className}`}
    >
      <div className="text-center text-violet-200 text-5xl font-black leading-10">Elevate your technical interview prep.</div>
    </main>
  )
}
