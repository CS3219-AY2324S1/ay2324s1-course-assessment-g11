import { Question } from "../../types/QuestionTypes";
import { Card } from "../ui/card";
import { TypographyH2, TypographySmall } from "../ui/typography";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

type SolutionProps = {
  question: Question;
  className?: string;
  hasRoom?: boolean;
};

export default function Solution({
  question,
  className,
  hasRoom = true,
}: SolutionProps) {

  return (
    <Card
      className={`m-2 ml-0 px-6 h-full ${className} overflow-y-auto overflow-x-wrap pb-4`}
    >
      <div className="flex flex-row items-center justify-between py-2">
        <div className="flex items-center justify-center">
          <TypographyH2 className="w-fit">Solution</TypographyH2>
        </div>
      </div>
      <div className="pb-6 w-[43vw]">
        <TypographySmall>
          <SyntaxHighlighter language="python" style={vscDarkPlus} showLineNumbers wrapLines>
            { question.solution?.python ? question.solution.python : `# Sample solution code to demo syntax highlighting.
import sys
class Solution(object):
    def isValidBST(self, root):
        return self.isVaild_helper(root, -sys.maxint - 1, sys.maxint)

    def isVaild_helper(self, root, minVal, maxVal):
        if root is None:
            return True
        if root.val >= maxVal or root.val <= minVal:
            return False
        return self.isVaild_helper(root.left, minVal, root.val) and self.isVaild_helper(root.right, root.val, maxVal)
`}
          </SyntaxHighlighter>
        </TypographySmall>
      </div>
    </Card>
  );
}
