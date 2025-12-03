// types/team.ts or add to an existing types file
export interface Team {
  _id: string;
  name: string;
  shift: number | string;
  department?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const shiftOne = [
  "Botany",
  "Chemistry",
  "Commerce",
  "Computer Science",
  "Economics",
  "English",
  "HRM",
  "History",
  "Mathematics",
  "Physics",
  "Statistics",
  "Tamil",
];

export const shiftTwo = [
  "Bio-Chemistry & Bio-Technology",
  "Business Administration (BBA)",
  "B.Com Honours",
  "B.Voc SD & SA",
  "B.Com SF & BA, Physical Education",
  "B.Voc Viscom Tech & B.Sc Viscom",
  "Commerce",
  "Commerce CA",
  "Counselling Psychology",
  "Computer Science",
  "Data Sci. & AI",
  "Electronics",
  "English",
  "Information Technology",
  "Mathematics",
  "Physics",
];
