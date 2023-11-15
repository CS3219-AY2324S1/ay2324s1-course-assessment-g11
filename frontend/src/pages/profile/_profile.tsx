import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  TypographyBody,
  TypographyH3,
  TypographyH2,
} from "@/components/ui/typography";
import { Attempt } from "@/types/UserTypes";
import { User } from "firebase/auth";
import Link from "next/link";
import ActivityCalendar, { Activity } from "react-activity-calendar";
import { Tooltip as MuiTooltip } from "@mui/material";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/profile/data-table";
import { columns } from "@/components/profile/columns";
import { DotWave } from "@uiball/loaders";

export type UserProfile = {
  uid: string;
  displayName?: string | null;
  photoURL?: string | null;
  email?: string | null;
};

type ProfileProps = {
  selectedUser: UserProfile;
  loadingState: "loading" | "error" | "success";
  attempts?: Attempt[];
  isCurrentUser: boolean;
};

export default function Profile({
  selectedUser,
  attempts,
  isCurrentUser,
  loadingState,
}: ProfileProps) {
  console.log(selectedUser);
  const getInitials = (name: string) => {
    if (!name) return "Annonymous";
    const names = name.split(" ");
    let initials = "";
    names.forEach((n) => {
      initials += n[0].toUpperCase();
    });
    return initials;
  };

  const date = new Date();
  const dateTodayString = date.toISOString().slice(0, 10);
  date.setFullYear(date.getFullYear() - 1);
  const dateLastYearString = date.toISOString().slice(0, 10);

  // We need a date from last year to make sure the calendar is styled properly
  const countsByDate: Record<string, Activity> = {
    [dateTodayString]: { date: dateTodayString, count: 0, level: 0 },
    [dateLastYearString]: { date: dateLastYearString, count: 0, level: 0 },
  };

  if (loadingState === "success") {
    // Transform attempts into activities and accumulate counts
    attempts?.forEach((attempt) => {
      const date = attempt.time_created.toISOString().slice(0, 10); // Format the date as yyyy-MM-dd

      if (!countsByDate[date]) {
        countsByDate[date] = { date, count: 0, level: 1 };
      }

      countsByDate[date].count += 1;

      // Set the level of the activity based on the number of activities on that day
      if (countsByDate[date].count === 1) {
        countsByDate[date].level = 1;
      } else if (countsByDate[date].count > 1 && countsByDate[date].count < 5) {
        countsByDate[date].level = 2;
      } else if (
        countsByDate[date].count >= 5 &&
        countsByDate[date].count < 10
      ) {
        countsByDate[date].level = 3;
      } else if (countsByDate[date].count >= 10) {
        countsByDate[date].level = 4;
      }
    });
  }

  // Extract the values from the dictionary to get the final activities array
  const activities = Object.values(countsByDate).sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  return (
    <div className="max-w-7xl mx-auto flex justify-center items-start">
      <div className="max-w-sm mx-4 my-20">
        <div className="flex items-center w-full justify-center gap-x-4 p-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={selectedUser?.photoURL ?? ""} />
            <AvatarFallback>
              {getInitials(selectedUser?.displayName ?? "")}
            </AvatarFallback>
          </Avatar>
          <div>
            <TypographyH3>{selectedUser?.displayName}</TypographyH3>
            <TypographyBody>{selectedUser?.email}</TypographyBody>
          </div>
        </div>
        {isCurrentUser && (
          <Link href="/settings">
            <Button className="w-full" variant="secondary">
              Edit Profile
            </Button>
          </Link>
        )}
      </div>
      <div className="flex flex-col gap-12 p-12">
        <Card>
          <CardHeader>
            <CardTitle>
              <TypographyH2>Activity</TypographyH2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityCalendar
              data={activities}
              theme={{
                dark: ["#161B22", "#241D4F", "#3C3180", "#5245AD", "#8270FE"],
              }}
              renderBlock={(block, activity) => (
                <MuiTooltip
                  title={`${activity.count} activities on ${activity.date}`}
                >
                  {block}
                </MuiTooltip>
              )}
              labels={{
                totalCount: "{{count}} activities in 2023",
              }}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <TypographyH2>Attempts</TypographyH2>
          </CardHeader>
          <CardContent>
            {loadingState === "loading" ? (
              <div className="h-32 flex items-center justify-center">
                <DotWave size={47} speed={1} color="white" />
              </div>
            ) : loadingState === "error" ? (
              <div className="h-32 flex items-center justify-center">
                <TypographyBody>
                  Something went wrong. Please try again later.
                </TypographyBody>
              </div>
            ) : (
              <DataTable columns={columns} data={attempts || []} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
