import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from "@/contexts/AuthContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useContext } from "react";

interface AuthCheckerProps {
  children: React.ReactNode;
}

export default function AuthChecker({ children }: AuthCheckerProps) {
  const auth = getAuth();
  const router = useRouter();
  const { user: currentUser, authIsReady } = useContext(AuthContext);

  const currentPage = router.pathname;

  useEffect(() => {
    if (!currentUser && currentPage !== "/") {
      console.log("Auth", currentPage);
      onAuthStateChanged(auth, (user) => {
        if (!user) {
          router.push("/");
        }
      });
    }
  });

  if (currentPage === "/") {
    return children;
  }

  return (currentUser && children)
}