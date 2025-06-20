export type QuizStep = 
  | "welcome"
  | "user-type"
  | "age-check"
  | "student-info"
  | "parent-info"
  | "child-info"
  | "school-info"
  | "location"
  | "contact"
  | "interests"
  | "review"
  | "complete";

export interface QuizData {
  userType: "student" | "parent" | "school" | null;
  age?: number;
  birthDate?: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  county?: string;
  constituency?: string;
  ward?: string;
  interests?: string[];
  // Student specific
  gradeLevel?: string;
  subjects?: string[];
  // Parent specific
  childFirstName?: string;
  childLastName?: string;
  childBirthDate?: string;
  childGrade?: string;
  // School specific
  schoolName?: string;
  contactName?: string;
  role?: string;
  schoolType?: string;
  studentPopulation?: string;
  gradeRange?: string;
  hasComputerLab?: string;
  currentTechnology?: string;
  curriculum?: string;
  painPoints?: string;
  budget?: string;
  timeline?: string;
}

export const interests = [
  "Mathematics", "Science", "Literature", "History", "Geography",
  "Computer Science", "Art", "Music", "Sports", "Languages"
];

export const subjects = [
  "Mathematics", "English", "Kiswahili", "Science", "Social Studies",
  "Christian Religious Education", "Islamic Religious Education",
  "Hindu Religious Education", "Life Skills", "Creative Arts"
];