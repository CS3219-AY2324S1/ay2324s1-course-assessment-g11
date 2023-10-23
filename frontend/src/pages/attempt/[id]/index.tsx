import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TypographyBody, TypographyCode, TypographyH2 } from "@/components/ui/typography";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen p-12 mx-auto max-w-3xl flex flex-col gap-8">
      <div className="flex gap-x-4 items-center">
        <Button className="gap-2" size="sm" variant="ghost" onClick={router.back}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <TypographyH2>Attempt</TypographyH2>
      </div>

      <div>
        <Label className="text-primary">Question</Label>
        <TypographyBody>Two Sum</TypographyBody>
      </div>

      <div>
        <Label className="text-primary">Attempted At</Label>
        <TypographyBody>23/10/2023 15:00</TypographyBody>
      </div>

      <div>
        <Label className="text-primary">Mode of Attempt</Label>
        <TypographyBody>Interview • with Chun Wei</TypographyBody>
      </div>

      <div>
        <Label className="text-primary">Solution</Label>
        <TypographyBody>Solved</TypographyBody>
        <Textarea disabled={true} className="my-4" defaultValue={'class Solution:  def twoSum(self, nums: List[int], target: int) -> List[int]:        numToIndex = {}        for i in range(len(nums)):            if target - nums[i] in numToIndex:                return [numToIndex[target - nums[i]], i]            numToIndex[nums[i]] = i        return []'}>
        </Textarea>
      </div>
    </div> 
  )
}
