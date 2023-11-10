import Loader from "@/components/interviews/loader";
import { Button } from "@/components/ui/button";
import { TypographyBody, TypographyH2 } from "@/components/ui/typography";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMatchmaking } from "@/hooks/useMatchmaking";

export default function FindMatch() {
  const router = useRouter();
  const { match, cancelLooking } = useMatchmaking();
  const { query } = router;
  const { retry } = query;

  const onClickCancel = () => {
    cancelLooking();
    router.push("/interviews");
  };

  useEffect(() => {
    if (retry) {
      router.push("/interviews");
    }
  }, [retry, router]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    if (match) {
      router.push("/interviews/match-found");
    } else {
      timeout = setTimeout(() => {
        cancelLooking();
        router.push("/interviews/match-not-found");
      }, 30000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match, router]);

  return (
    <div className="min-h-screen p-12 mx-auto max-w-7xl flex flex-col justify-evenly items-center">
      <div className="gap-y-6 flex flex-col justify-center items-center">
        <TypographyH2>Finding a match for your interview prep...</TypographyH2>

        <TypographyBody>Estimated time: 25 secs</TypographyBody>
      </div>

      <Loader />

      <Button variant="secondary" onClick={onClickCancel}>
        Cancel Search
      </Button>
    </div>
  );
}
