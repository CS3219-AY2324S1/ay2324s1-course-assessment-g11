import Spotlight, { SpotlightCard } from "@/components/ui/spotlight";
import { TypographyH1, TypographyH3 } from "@/components/ui/typography";
import Image from "next/image";

export default function Home() {
  return (
    <Spotlight className="group">
      <SpotlightCard>
        <div className="p-24 mt-12 flex flex-col items-center justify-center text-center">
          <TypographyH1 className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4">
            Elevate your technical interview prep.
          </TypographyH1>
          <TypographyH3 className="text-foreground mb-8">
            Crush technical interviews by polishing your skills with friends.
          </TypographyH3>
          <Image
            src={"/hero-image.jpeg"}
            width={800}
            height={600}
            alt="Screenshot of the collaboration feature"
            className="shadow-2xl shadow-secondary/20 shadow-ring-10"
          />
        </div>
      </SpotlightCard>
    </Spotlight>
  );
}
