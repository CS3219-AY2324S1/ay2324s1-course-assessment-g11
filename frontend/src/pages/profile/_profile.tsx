import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button";
import { TypographyBody, TypographyH3 } from "@/components/ui/typography";
import { Attempt } from "@/types/UserTypes";
import { User } from "firebase/auth";
import Link from "next/link";
import ActivityCalendar, { Activity } from "react-activity-calendar";
import { Tooltip as MuiTooltip } from '@mui/material';

type ProfileProps = {
  selectedUser: User,
  attempts?: Attempt[],
  isCurrentUser: boolean,
}

export default function Profile({ selectedUser, attempts, isCurrentUser }: ProfileProps) {
  const getInitials = (name: string) => {
    const names = name.split(" ");
    let initials = "";
    names.forEach((n) => {
      initials += n[0].toUpperCase();
    });
    return initials;
  }

  const date = new Date();
  date.setFullYear(date.getFullYear() - 1)
  const dateLastYearString = date.toISOString().slice(0, 10);

  const countsByDate: Record<string, Activity> = {
    [dateLastYearString]: { date: dateLastYearString, count: 0, level: 0 },
  };

  // Transform attempts into activities and accumulate counts
  attempts?.forEach((attempt) => {
    const date = attempt.time_created.toISOString().slice(0, 10); // Format the date as yyyy-MM-dd
    const level = attempt.solved ? 3 : 1; // Set level based on the solved status

    if (!countsByDate[date]) {
      countsByDate[date] = { date, count: 0, level };
    }

    countsByDate[date].count += 1;
  });

  // Extract the values from the dictionary to get the final activities array
  const activities = Object.values(countsByDate).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="max-w-7xl mx-auto flex flex-col justify-center items-center">
      <div className="max-w-sm m-4">
        <div className="flex items-center w-full justify-center gap-x-4 p-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={selectedUser?.photoURL ?? ''} />
            <AvatarFallback>{getInitials(selectedUser?.displayName ?? '')}</AvatarFallback>
          </Avatar>
          <div>
            <TypographyH3>{selectedUser?.displayName}</TypographyH3>
            <TypographyBody>{selectedUser?.email}</TypographyBody>
          </div>
        </div>
        {isCurrentUser &&
          <Link href="/settings">
            <Button className="w-full" variant="secondary">
              Edit Profile
            </Button>
          </Link>
        }
      </div>
      <ActivityCalendar
        data={activities}
        theme={{
          dark: ['#161B22', '#241D4F', '#3C3180', '#5245AD', '#8270FE'],
        }}
        renderBlock={(block, activity) => (
          <MuiTooltip
            title={`${activity.count} activities on ${activity.date}`}
          >
            {block}
          </MuiTooltip>
        )}
        labels={{
          totalCount: '{{count}} activities in 2023',
        }}
      />
    </div>
  )
}
