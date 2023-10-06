import { TypographyBodyHeavy, TypographyH1, TypographyH2, TypographySmall } from '@/components/ui/typography'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState } from 'react';
import DifficultySelector from '@/components/common/difficulty-selector';

type Difficulty = 'easy' | 'medium' | 'hard' | 'any';

export default function Questions() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  return (
    <div className='min-h-screen p-12 mx-auto max-w-7xl'>

      <TypographyH1 className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary w-min mb-1">
        Questions
      </TypographyH1>

      <TypographyBodyHeavy>
        Practice our questions to ace your coding interview!
      </TypographyBodyHeavy>

      <div className='flex-col flex gap-4 my-12'>
        <TypographyH2 className="text-primary">
          Quick Practice
        </TypographyH2>
        <div>
          <TypographySmall>Choose question difficulty</TypographySmall>
          <div className="mt-2 mb-6 flex gap-2 bg-popover w-min rounded-lg">
            <DifficultySelector onChange={(value) => setDifficulty(value)} showAny={true} defaultValue={difficulty} />
          </div>
        </div>
        <Link href="/room"><Button variant={"outline"}>Give me a random question!</Button></Link>
      </div>

      <div className='flex-col flex gap-4 my-12'>
        <TypographyH2 className="text-primary">
          All Questions
        </TypographyH2>

      </div>
    </div>
  )
}
