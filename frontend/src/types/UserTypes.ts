export type EditableUser = {
  uid: string;
  displayName?: string | null;
  photoUrl?: string | null;
  matchDifficulty?: number | null;
  matchProgrammingLanguage?: string | null;
};

export type Attempt = {
  id: string;
  question_id: string;
  answer: string | null;
  solved: boolean;
  time_created: Date;
  time_saved_at: Date;
  time_updated: Date;
  room_id: string | null;
};
