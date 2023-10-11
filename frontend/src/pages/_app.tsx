import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import Layout from "../components/common/layout";
import { Noto_Sans } from "next/font/google";
import AuthContextProvider from "@/contexts/AuthContext";
import { MatchmakingProvider } from "../../providers/MatchmakingProvider";

const notoSans = Noto_Sans({
  weight: ["400", "500", "600", "700", "800", "900"],
  preload: false,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        :root {
          --font_noto_sans: ${notoSans.style.fontFamily};
        }
      `}</style>
      <main>
        <AuthContextProvider>
          <MatchmakingProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </MatchmakingProvider>
        </AuthContextProvider>
      </main>
    </>
  );
}
