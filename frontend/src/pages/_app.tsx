import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import Layout from "../components/common/layout";
import { Noto_Sans } from "next/font/google";
import AuthContextProvider from "@/contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
          <ToastContainer
            position="bottom-center"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthContextProvider>
      </main>
    </>
  );
}
