import { TypographyBodyHeavy, TypographyH1, TypographyH2, TypographySmall } from '@/components/ui/typography'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState } from 'react';
import DifficultySelector from '@/components/common/difficulty-selector';
import { columns, Question } from '@/components/questions/columns';
import { DataTable } from '@/components/questions/data-table';
import { PlusIcon } from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard' | 'any';

const questions: Question[] = [
  {
    title: 'Two Sum',
    difficulty: 'easy',
    tags: ['Array', 'Hash Table'],
  },
  {
    title: 'Add Two Numbers',
    difficulty: 'medium',
    tags: ['Linked List', 'Math'],
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'hard',
    tags: ['Hash Table', 'Two Pointers', 'String', 'Sliding Window'],
  }
]

export default function Questions() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  return (
    <div className='min-h-screen p-12 mx-auto max-w-7xl'>

      <div className='flex justify-between items-center'>
        <div>
          <TypographyH1 className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary w-min mb-1">
            Questions
          </TypographyH1>
          <TypographyBodyHeavy>
            Practice our questions to ace your coding interview!
          </TypographyBodyHeavy>
        </div>
        <Link href="/questions/new">
          <Button className='gap-2'>
            <PlusIcon />
            Contribute question
          </Button>
        </Link>
      </div>
      
      <div className='flex-col flex gap-4 py-20'>
        <TypographyH2 className="text-primary">
          Quick Practice
        </TypographyH2>
        <div>
          <TypographySmall>Choose question difficulty</TypographySmall>
          <DifficultySelector onChange={(value) => setDifficulty(value)} showAny={true} defaultValue={difficulty} />
        </div>
        <Link href="/room"><Button variant={"outline"}>Give me a random question!</Button></Link>
      </div>

      <div className='flex-col flex gap-4 py-12'>
        <TypographyH2 className="text-primary">
          All Questions
        </TypographyH2>
        <DataTable columns={columns} data={questions} />
      </div>
    </div>
  )
}
