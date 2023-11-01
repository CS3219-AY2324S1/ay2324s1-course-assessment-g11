import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useUser } from "@/hooks/useUser";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { EditableUser } from "@/types/UserTypes";
import DifficultySelector from "@/components/common/difficulty-selector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Difficulty } from "@/types/QuestionTypes";
import { DotWave } from "@uiball/loaders";


export default function MatchSettingsCard() {
  const { user: currentUser } = useContext(AuthContext);
  const { updateUser, getAppUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const [updatedUser, setUpdatedUser] = useState<EditableUser>({ uid: currentUser?.uid ?? '' } as EditableUser);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('c++');

  useEffect(() => {
    if (currentUser) {
      getAppUser().then((user) => {
        if (user) {
          setSelectedDifficulty(user.matchDifficulty);
          setSelectedLanguage(user.matchProgrammingLanguage);
        }
        setIsLoading(false);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser])

  useEffect(() => {
    setUpdatedUser((prev) => ({ ...prev, matchDifficulty: selectedDifficulty }));
  }, [selectedDifficulty]);

  useEffect(() => {
    setUpdatedUser((prev) => ({ ...prev, matchProgrammingLanguage: selectedLanguage }));
  }, [selectedLanguage]);

  return (
    <Card id="match" className="p-10">
      <CardHeader>
        <CardTitle>Match Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <DotWave
              size={47}
              speed={1}
              color="white"
            />
          </div>
        ) : (
        <CardDescription className="flex flex-col gap-y-10">
          <div>
            <Label className="mb-2">Preferred Programming Language</Label>
            <Select value={selectedLanguage} onValueChange={(lang) => {
                setShowSuccess(false);
                setSelectedLanguage(lang);
              }}>
              <SelectTrigger>
                <SelectValue placeholder="Select Language" defaultValue="python"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="python">Python</SelectItem>
                {/* <SelectItem value="javascript">Javascript</SelectItem> */}
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="c++">C++</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2">Preferred Difficulty</Label>
            <DifficultySelector showAny={true} value={selectedDifficulty} onChange={(value) => {
              setShowSuccess(false);
              setSelectedDifficulty(value);
            }} />
          </div>
          <div className="flex flex-row items-center gap-x-2">
            <Button ref={submitButtonRef} className="w-fit" onClick={() => {
                submitButtonRef.current?.setAttribute('disabled', 'true');
                updateUser(updatedUser).then(() => {
                  submitButtonRef.current?.removeAttribute('disabled');
                  setShowSuccess(true);
                });
              }}>Save Changes</Button>
            {showSuccess && (
              <span className="text-green-500">Successfully updated match preferences!</span>
            )}
          </div>
        </CardDescription>
        )}
        
      </CardContent>
    </Card>
  )
}