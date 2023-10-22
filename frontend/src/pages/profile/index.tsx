import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import Profile from "./_profile";
import { Attempt } from "@/types/UserTypes";

export default function Page() {
  const { user: currentUser } = useContext(AuthContext);

  const attempts: Attempt[] = [
    {
      id: "1",
      question_id: "1",
      answer: "A1",
      solved: true,
      time_created: new Date("2023-10-23T08:00:00"),
      time_saved_at: new Date("2023-10-23T08:15:00"),
      time_updated: new Date("2023-10-23T08:15:00"),
      room_id: "Room1",
    },
    {
      id: "2",
      question_id: "2",
      answer: "A2",
      solved: true,
      time_created: new Date("2023-10-23T08:30:00"),
      time_saved_at: new Date("2023-10-23T08:45:00"),
      time_updated: new Date("2023-10-23T08:45:00"),
      room_id: "Room1",
    },
    {
      id: "3",
      question_id: "3",
      answer: "A3",
      solved: true,
      time_created: new Date("2023-10-23T09:00:00"),
      time_saved_at: new Date("2023-10-23T09:15:00"),
      time_updated: new Date("2023-10-23T09:15:00"),
      room_id: "Room2",
    },
    {
      id: "4",
      question_id: "4",
      answer: "A4",
      solved: false,
      time_created: new Date("2023-10-23T09:30:00"),
      time_saved_at: new Date("2023-10-23T09:45:00"),
      time_updated: new Date("2023-10-23T09:45:00"),
      room_id: "Room2",
    },
    {
      id: "5",
      question_id: "5",
      answer: "A5",
      solved: false,
      time_created: new Date("2023-10-23T10:00:00"),
      time_saved_at: new Date("2023-10-23T10:15:00"),
      time_updated: new Date("2023-10-23T10:15:00"),
      room_id: null,
    },
    {
      id: "6",
      question_id: "6",
      answer: null,
      solved: false,
      time_created: new Date("2023-10-23T10:30:00"),
      time_saved_at: new Date("2023-10-23T10:45:00"),
      time_updated: new Date("2023-10-23T10:45:00"),
      room_id: null,
    },
    {
      id: "7",
      question_id: "7",
      answer: "A7",
      solved: true,
      time_created: new Date("2023-10-23T11:00:00"),
      time_saved_at: new Date("2023-10-23T11:15:00"),
      time_updated: new Date("2023-10-23T11:15:00"),
      room_id: "Room3",
    },
    {
      id: "8",
      question_id: "8",
      answer: "A8",
      solved: true,
      time_created: new Date("2023-10-23T11:30:00"),
      time_saved_at: new Date("2023-10-23T11:45:00"),
      time_updated: new Date("2023-10-23T11:45:00"),
      room_id: "Room3",
    },
    {
      id: "9",
      question_id: "9",
      answer: "A9",
      solved: true,
      time_created: new Date("2023-10-23T12:00:00"),
      time_saved_at: new Date("2023-10-23T12:15:00"),
      time_updated: new Date("2023-10-23T12:15:00"),
      room_id: "Room4",
    },
    {
      id: "10",
      question_id: "10",
      answer: "A10",
      solved: false,
      time_created: new Date("2023-10-23T12:30:00"),
      time_saved_at: new Date("2023-10-23T12:45:00"),
      time_updated: new Date("2023-10-23T12:45:00"),
      room_id: "Room4",
    },
  ];

  return (
    (currentUser && <Profile selectedUser={currentUser} isCurrentUser={true} />)
  )
}
