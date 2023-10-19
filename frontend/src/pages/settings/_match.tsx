import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useUser } from "@/hooks/useUser";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { EditableUser } from "@/types/UserTypes";
import DifficultySelector from "@/components/common/difficulty-selector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Difficulty } from "@/types/QuestionTypes";


export default function MatchSettingsCard() {
  const { user: currentUser } = useContext(AuthContext);
  const { updateUser } = useUser();

  const [updatedUser, setUpdatedUser] = useState<EditableUser>({ uid: currentUser?.uid ?? '' } as EditableUser);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');

  useEffect(() => {
    console.log(updatedUser);
  }, [updatedUser]);

  useEffect(() => {
    console.log(selectedDifficulty);
  }, [selectedDifficulty]);

  return (
    <Card id="match" className="p-10">
      <CardHeader>
        <CardTitle>Match Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="flex flex-col gap-y-10">
          <div>
            <Label className="mb-2">Preferred Programming Language</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Language" defaultValue="python"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="javascript">Javascript</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="c++">c++</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2">Email</Label>
            <DifficultySelector showAny={true} value={selectedDifficulty} onChange={(value) => setSelectedDifficulty(value)} />
          </div>
          <Button className="w-fit" onClick={() => updateUser(updatedUser)}>Save Changes</Button>
        </CardDescription>
      </CardContent>
    </Card>
  )
}