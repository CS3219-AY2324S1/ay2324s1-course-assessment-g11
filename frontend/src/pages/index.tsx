import { Button } from '@/components/ui/button'
import Spotlight, { SpotlightCard } from '@/components/ui/spotlight'
import { TypographyH1, TypographyH3 } from '@/components/ui/typography'
import Image from 'next/image'
import { AiFillGithub } from 'react-icons/ai'
import { useLogin } from "@/firebase-client/useLogin";
import { useLogout } from "@/firebase-client/useLogout";
import { useDeleteOwnAccount } from "@/firebase-client/useDeleteOwnAccount";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";

export default function Home() {
  const { login, isPending } = useLogin();
  const { logout } = useLogout();
  const { deleteOwnAccount } = useDeleteOwnAccount();

  const { user, authIsReady } = useContext(AuthContext);

  return (
    <Spotlight className="group">
      <SpotlightCard>
        <div className="p-24 mt-12 flex flex-col items-center justify-center text-center">
          <TypographyH1 className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4">Elevate your technical interview prep.</TypographyH1>
          <TypographyH3 className="text-foreground mb-8">Crush technical interviews by polishing your skills with friends.</TypographyH3>
          {
            authIsReady ? (
              user ? [
                <Button key="logout" className="mb-16" onClick={logout}>
                  <AiFillGithub className="mr-2 w-6 h-6" />
                  {isPending && !authIsReady ? "Loading..." : "Sign out"}
                </Button>,
                <Button key="deleteAccount" className="mb-16" onClick={deleteOwnAccount}>
                  <AiFillGithub className="mr-2 w-6 h-6" />
                  {isPending ? "Loading..." : "Delete your account on this app"}
                </Button>
              ] : (
                <Button className="mb-16" onClick={login}>
                  <AiFillGithub className="mr-2 w-6 h-6" />
                  {isPending ? "Loading..." : "Sign up with GitHub"}
                </Button>
              )
            ) : (
              <div>
                Loading authentication status. Please wait...
              </div>
            )
          }
          <Image src={'/hero-image.jpeg'} width={800} height={600} alt="Screenshot of the collaboration feature" className="shadow-2xl shadow-secondary/20 shadow-ring-10" />
        </div>
      </SpotlightCard>
    </Spotlight>
  )
}
