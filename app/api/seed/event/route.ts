import { NextResponse } from "next/server";
import connectDB from "@/app/api/db/connection";
import Event from "@/models/Event";

const seedData = [
  // OFF-STAGE
  {
    category: "SPECIAL",
    stageType: "OFF_STAGE",
    title: "INDEP Logo Design",
    date: "2023-01-04",
    time: "12:30 PM",
    venue: "Lawley Hall",
    incharge: [{ name: "Dr. V. Francis", department: "English" }],
  },
  {
    category: "SPECIAL",
    stageType: "OFF_STAGE",
    title: "Essay Writing (Tamil / English) - Pongal",
    date: "2023-01-04",
    time: "12:30 PM",
    venue: "Lawley Hall",
    incharge: [{ name: "Dr. S. Backya Selva Rathi", department: "" }],
  },
  {
    category: "INDEP",
    stageType: "OFF_STAGE",
    title: "Poetry Writing - Tamil",
    date: "2023-01-07",
    time: "11:30 AM",
    venue: "Fr. K.P. Joseph Hall",
    incharge: [{ name: "Dr. L. Charles", department: "Tamil" }],
  },
  {
    category: "INDEP",
    stageType: "OFF_STAGE",
    title: "Poetry Writing - English",
    date: "2023-01-07",
    time: "11:30 AM",
    venue: "Fr. K.P. Joseph Hall",
    incharge: [{ name: "Dr. I. Arockiaraj", department: "Chemistry" }],
  },
  {
    category: "INDEP",
    stageType: "OFF_STAGE",
    title: "Quiz - Prelims",
    date: "2023-01-07",
    time: "10:00 AM",
    venue: "JCICT Lab",
    incharge: [{ name: "Dr. J. Anonty John Prabu", department: "CS" }],
  },
  {
    category: "INDEP",
    stageType: "OFF_STAGE",
    title: "Collage",
    date: "2023-01-07",
    time: "11:30 AM",
    venue: "Fr. K.P. Joseph Hall",
    incharge: [{ name: "Dr. V. Francis", department: "English" }],
  },
  {
    category: "INDEP",
    stageType: "OFF_STAGE",
    title: "Cartooning",
    date: "2023-01-07",
    time: "3:00 PM",
    venue: "Fr. K.P. Joseph Hall",
    incharge: [{ name: "Dr. M.S. Madhavachari", department: "Sanskrit" }],
  },
  {
    category: "INDEP",
    stageType: "OFF_STAGE",
    title: "Dancing Brush",
    date: "2023-01-09",
    time: "11:30 AM",
    venue: "Fr. K.P. Joseph Hall",
    incharge: [{ name: "Dr. Alphonsa Helena", department: "Chemistry" }],
  },
  {
    category: "INDEP",
    stageType: "OFF_STAGE",
    title: "Poster Making",
    date: "2023-01-09",
    time: "3:00 PM",
    venue: "Fr. K.P. Joseph Hall",
    incharge: [{ name: "Dr. S. Antony Sakthi", department: "Chemistry" }],
  },
  {
    category: "INDEP",
    stageType: "OFF_STAGE",
    title: "INDEP Director (Screened Only for Judges)",
    date: "2023-01-00",
    time: "",
    venue: "",
    incharge: [
      { name: "Dr. M. Suvakkin", department: "Economics" },
      { name: "Prof. K. Ramya", department: "Vis.Com" },
    ],
  },
  {
    category: "INDEP",
    stageType: "OFF_STAGE",
    title: "Rangoli",
    date: "2023-01-11",
    time: "8:30 AM",
    venue: "Infront of Lawley Hall",
    incharge: [
      { name: "Dr. N. Maheswari", department: "Com. CA" },
      { name: "Dr. R. Arul", department: "Com. CA" },
    ],
  },
  {
    category: "INDEP",
    stageType: "OFF_STAGE",
    title: "Spot Photography",
    date: "2023-01-09",
    time: "3:30 PM",
    venue: "Infront of Arrupe Library Building",
    incharge: [{ name: "Mr. G. Sathish", department: "Vis. Com" }],
  },

  // ON-STAGE
  {
    category: "DANCE",
    stageType: "ON_STAGE",
    title: "Classical Dance",
    date: "2023-01-12",
    time: "10:30 AM",
    venue: "SAIL Hall",
    incharge: [{ name: "Dr. F. X. Virgin Fraga", department: "B.Com CA" }],
  },
  {
    category: "DANCE",
    stageType: "ON_STAGE",
    title: "Folk Dance",
    date: "2023-01-12",
    time: "10:00 AM",
    venue: "Open Stage",
    incharge: [
      { name: "Dr. S. Srinivasan", department: "Tamil" },
      { name: "Dr. R. Nallamuthu", department: "Tamil" },
    ],
  },
  {
    category: "DANCE",
    stageType: "ON_STAGE",
    title: "Western Dance",
    date: "2023-01-12",
    time: "2:30 PM",
    venue: "Open Stage",
    incharge: [
      { name: "Dr. G. Ani Rose", department: "English" },
      { name: "Dr. M. Bastin Churchill", department: "Botany" },
    ],
  },
  {
    category: "THEATRE",
    stageType: "ON_STAGE",
    title: "Skit",
    date: "2023-01-12",
    time: "1:30 PM",
    venue: "Lawley Hall",
    incharge: [
      { name: "Dr. S. Britto Ramesh Kumar", department: "CS" },
      { name: "Dr. S. Sree Devi", department: "Hindi" },
    ],
  },
  {
    category: "THEATRE",
    stageType: "ON_STAGE",
    title: "Addzup",
    date: "2023-01-12",
    time: "10:30 AM",
    venue: "Lawley Hall",
    incharge: [{ name: "Ms. Prarthna", department: "Economics" }],
  },
  {
    category: "THEATRE",
    stageType: "ON_STAGE",
    title: "Mimicry",
    date: "2023-01-12",
    time: "1:00 PM",
    venue: "Open Stage",
    incharge: [{ name: "Dr. S. Aseervatham", department: "Maths" }],
  },
  {
    category: "MUSIC",
    stageType: "ON_STAGE",
    title: "Western Group",
    date: "2023-01-12",
    time: "10:30 AM",
    venue: "Fr KP Joseph Hall",
    incharge: [{ name: "Prof. K. Primrose", department: "English" }],
  },
  {
    category: "MUSIC",
    stageType: "ON_STAGE",
    title: "Indian Group",
    date: "2023-01-12",
    time: "1:30 PM",
    venue: "Fr KP Joseph Hall",
    incharge: [{ name: "Dr. A.S. Stella Shalini", department: "Chemistry" }],
  },
  {
    category: "MUSIC",
    stageType: "ON_STAGE",
    title: "Instrumental",
    date: "2023-01-12",
    time: "1:30 PM",
    venue: "SAIL Hall",
    incharge: [{ name: "Dr. K.A. Micheal", department: "Economics" }],
  },
  {
    category: "LITERARY",
    stageType: "ON_STAGE",
    title: "Elocution in Tamil",
    date: "2023-01-12",
    time: "11:00 AM",
    venue: "Commerce AV Hall",
    incharge: [{ name: "Dr. A. Maria Dhanabal", department: "" }],
  },
  {
    category: "LITERARY",
    stageType: "ON_STAGE",
    title: "Elocution in English",
    date: "2023-01-12",
    time: "2:00 PM",
    venue: "Commerce AV Hall",
    incharge: [{ name: "Mr. D. Prasanth", department: "English" }],
  },
];

export async function GET() {
  await connectDB();
  try {
    // Clear existing events to avoid duplicates during development
    await Event.deleteMany({});

    // Insert seed data
    await Event.insertMany(seedData);

    return NextResponse.json({
      message: "Database seeded successfully with events!",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Seeding failed", details: error },
      { status: 500 }
    );
  }
}
