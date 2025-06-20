import { z } from "zod";

// Age verification schema
export const ageVerificationSchema = z.object({
  birthDate: z.string().min(1, "Birth date is required"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
});

// Student signup schema (13-17)
export const studentSignupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  parentPhone: z.string().min(10, "Valid parent phone number required"),
  parentName: z.string().min(2, "Parent name is required"),
  gradeLevel: z.string().min(1, "Grade level is required"),
  agreeToTerms: z.boolean().refine(val => val, "You must agree to the terms"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Adult signup schema (18+)
export const adultSignupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  phone: z.string().min(10, "Valid phone number required"),
  accountType: z.enum(["student", "parent", "tutor"]),
  agreeToTerms: z.boolean().refine(val => val, "You must agree to the terms"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Parent signup for child schema
export const parentChildSignupSchema = z.object({
  parentEmail: z.string().email("Invalid email address"),
  parentPassword: z.string().min(8, "Password must be at least 8 characters"),
  parentPhone: z.string().min(10, "Valid phone number required"),
  parentFirstName: z.string().min(2, "First name is required"),
  parentLastName: z.string().min(2, "Last name is required"),
  county: z.string().min(1, "County is required"),
  constituency: z.string().min(1, "Constituency is required"),
  ward: z.string().min(1, "Ward is required"),
  childFirstName: z.string().min(2, "Child's first name is required"),
  childLastName: z.string().min(2, "Child's last name is required"),
  childBirthDate: z.string().min(1, "Child's birth date is required"),
  gradeLevel: z.string().min(1, "Grade level is required"),
  agreeToTerms: z.boolean().refine(val => val, "You must agree to the terms"),
});

// School demo request schema
export const schoolDemoSchema = z.object({
  schoolName: z.string().min(2, "School name is required"),
  contactName: z.string().min(2, "Contact name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
  role: z.string().min(1, "Please select your role"),
  schoolType: z.string().min(1, "Please select school type"),
  county: z.string().min(1, "County is required"),
  constituency: z.string().min(1, "Constituency is required"),
  ward: z.string().min(1, "Ward is required"),
  studentPopulation: z.string().min(1, "Student population is required"),
  gradeRange: z.string().min(1, "Grade range is required"),
  hasComputerLab: z.string().min(1, "Please specify if you have a computer lab"),
  currentTechnology: z.string().min(1, "Please describe current technology"),
  curriculum: z.string().min(1, "Curriculum type is required"),
  painPoints: z.string().min(10, "Please describe your main challenges"),
  budget: z.string().min(1, "Budget range is required"),
  timeline: z.string().min(1, "Implementation timeline is required"),
});

export type AgeVerificationForm = z.infer<typeof ageVerificationSchema>;
export type StudentSignupForm = z.infer<typeof studentSignupSchema>;
export type AdultSignupForm = z.infer<typeof adultSignupSchema>;
export type ParentChildSignupForm = z.infer<typeof parentChildSignupSchema>;
export type SchoolDemoForm = z.infer<typeof schoolDemoSchema>;

export type SignupStep = "age-check" | "signup" | "verification" | "complete";
export type SignupType = "student" | "parent" | "adult" | "school" | null;