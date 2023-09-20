import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout'
import { Noto_Sans } from 'next/font/google'

const notoSans = Noto_Sans({
  weight: ['400', '500', '600', '700', '800', '900'],
  preload: false
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        :root {
          --font_noto_sans: ${notoSans.style.fontFamily};
        }
      `}</style>
      <main>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </main>
    </>
  )
}
