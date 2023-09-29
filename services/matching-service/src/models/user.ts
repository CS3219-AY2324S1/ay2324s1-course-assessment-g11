export interface User {
  id: number;
  preferences: any;
  skills: string[];
  interests: string[];
  profilePicture: string;
  name: string;
  email: string;
  role: string;
  isLookingForMatch: boolean;
}
