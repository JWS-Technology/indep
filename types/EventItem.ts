export interface EventItem {
  _id: string;
  title: string;
  category: string;
  stageType: "ON_STAGE" | "OFF_STAGE";
  venue: string;
  date: string;
  time?: string;
  incharge?: { name: string; department: string }[];
  status?: string;
}
