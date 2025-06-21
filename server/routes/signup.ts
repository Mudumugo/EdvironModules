import { Router } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { storage } from "../storage";
import {
  studentSignupSchema,
  adultSignupSchema,
  parentChildSignupSchema,
  schoolDemoRequestValidationSchema,
  type StudentSignupForm,
  type AdultSignupForm,
  type ParentChildSignupForm,
  type SchoolDemoForm,
} from "@shared/schemas/signup.schema";

const router = Router();

// Utility function to calculate age
function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// Generate verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send verification SMS (mock implementation)
async function sendVerificationSMS(phone: string, code: string, message: string): Promise<boolean> {
  // In a real implementation, this would use a service like Twilio
  console.log(`SMS to ${phone}: ${message} Code: ${code}`);
  return true;
}

// Student signup (13-17) - requires parent verification
router.post("/student", async (req, res) => {
  try {
    const validatedData = studentSignupSchema.parse(req.body);
    
    // Calculate age to verify student status
    const age = calculateAge(validatedData.birthDate);
    if (age < 13 || age >= 18) {
      return res.status(400).json({ 
        error: "Student signup is only available for ages 13-17" 
      });
    }

    // Check if email already exists
    const existingUser = await storage.getUserByEmail(validatedData.email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create signup request (pending verification)
    const signupRequestId = uuidv4();
    const signupRequest = await storage.createSignupRequest({
      id: signupRequestId,
      email: validatedData.email,
      hashedPassword,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      birthDate: validatedData.birthDate,
      accountType: "student",
      gradeLevel: validatedData.gradeLevel,
      parentName: validatedData.parentName,
      parentPhone: validatedData.parentPhone,
      verificationRequired: true,
      isVerified: false,
      tenantId: "default",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // Generate verification code
    const verificationCode = generateVerificationCode();
    
    // Create verification request
    await storage.createVerificationRequest({
      id: uuidv4(),
      userId: signupRequestId,
      verificationType: "parent_phone",
      contactMethod: validatedData.parentPhone,
      verificationCode,
      isVerified: false,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    });

    // Send verification SMS to parent
    const message = `Your child ${validatedData.firstName} ${validatedData.lastName} is trying to create an account. Use this code to verify:`;
    await sendVerificationSMS(validatedData.parentPhone, verificationCode, message);

    res.json({
      message: "Verification code sent to parent's phone",
      signupRequestId,
      parentPhone: validatedData.parentPhone.replace(/(\d{3})\d{3}(\d{4})/, "$1***$2"),
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", details: error.errors });
    }
    console.error("Student signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Adult signup (18+) - direct phone verification
router.post("/adult", async (req, res) => {
  try {
    const validatedData = adultSignupSchema.parse(req.body);
    
    // Calculate age to verify adult status
    const age = calculateAge(validatedData.birthDate);
    if (age < 18) {
      return res.status(400).json({ 
        error: "Adult signup requires age 18 or older" 
      });
    }

    // Check if email already exists
    const existingUser = await storage.getUserByEmail(validatedData.email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create signup request (pending verification)
    const signupRequestId = uuidv4();
    const signupRequest = await storage.createSignupRequest({
      id: signupRequestId,
      email: validatedData.email,
      hashedPassword,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      birthDate: validatedData.birthDate,
      accountType: validatedData.accountType,
      phone: validatedData.phone,
      verificationRequired: true,
      isVerified: false,
      tenantId: "default",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // Generate verification code
    const verificationCode = generateVerificationCode();
    
    // Create verification request
    await storage.createVerificationRequest({
      id: uuidv4(),
      userId: signupRequestId,
      verificationType: "phone",
      contactMethod: validatedData.phone,
      verificationCode,
      isVerified: false,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    });

    // Send verification SMS
    const message = `Your verification code is:`;
    await sendVerificationSMS(validatedData.phone, verificationCode, message);

    res.json({
      message: "Verification code sent to your phone",
      signupRequestId,
      phone: validatedData.phone.replace(/(\d{3})\d{3}(\d{4})/, "$1***$2"),
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", details: error.errors });
    }
    console.error("Adult signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Parent signup for child (under 13) - creates family account
router.post("/family", async (req, res) => {
  try {
    const validatedData = parentChildSignupSchema.parse(req.body);
    
    // Calculate child's age to verify family account requirement
    const childAge = calculateAge(validatedData.childBirthDate);
    if (childAge >= 13) {
      return res.status(400).json({ 
        error: "Family accounts are for children under 13. Older children can create their own accounts." 
      });
    }

    // Check if email already exists
    const existingUser = await storage.getUserByEmail(validatedData.parentEmail);
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.parentPassword, 12);

    // Create signup request with child data
    const signupRequestId = uuidv4();
    const childData = {
      firstName: validatedData.childFirstName,
      lastName: validatedData.childLastName,
      birthDate: validatedData.childBirthDate,
      gradeLevel: validatedData.gradeLevel,
    };

    const signupRequest = await storage.createSignupRequest({
      id: signupRequestId,
      email: validatedData.parentEmail,
      hashedPassword,
      firstName: validatedData.parentFirstName,
      lastName: validatedData.parentLastName,
      accountType: "family",
      phone: validatedData.parentPhone,
      childData,
      verificationRequired: true,
      isVerified: false,
      tenantId: "default",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // Generate verification code
    const verificationCode = generateVerificationCode();
    
    // Create verification request
    await storage.createVerificationRequest({
      id: uuidv4(),
      userId: signupRequestId,
      verificationType: "phone",
      contactMethod: validatedData.parentPhone,
      verificationCode,
      isVerified: false,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    });

    // Send verification SMS
    const message = `Your family account verification code is:`;
    await sendVerificationSMS(validatedData.parentPhone, verificationCode, message);

    res.json({
      message: "Verification code sent to your phone",
      signupRequestId,
      phone: validatedData.parentPhone.replace(/(\d{3})\d{3}(\d{4})/, "$1***$2"),
      childName: `${validatedData.childFirstName} ${validatedData.childLastName}`,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", details: error.errors });
    }
    console.error("Family signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Verify signup code
router.post("/verify", async (req, res) => {
  try {
    const { signupRequestId, verificationCode } = req.body;

    if (!signupRequestId || !verificationCode) {
      return res.status(400).json({ error: "Signup request ID and verification code required" });
    }

    // Get signup request
    const signupRequest = await storage.getSignupRequest(signupRequestId);
    if (!signupRequest) {
      return res.status(404).json({ error: "Signup request not found" });
    }

    // Check if request has expired
    if (new Date() > signupRequest.expiresAt) {
      return res.status(400).json({ error: "Signup request has expired" });
    }

    // Get verification request
    const verificationRequest = await storage.getVerificationRequest(signupRequestId, verificationCode);
    if (!verificationRequest) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    // Check if verification has expired
    if (new Date() > verificationRequest.expiresAt) {
      return res.status(400).json({ error: "Verification code has expired" });
    }

    // Mark verification as complete
    await storage.updateVerificationRequest(verificationRequest.id, {
      isVerified: true,
      verifiedAt: new Date(),
    });

    // Create the actual user account based on account type
    let userId;
    let familyAccountId;

    if (signupRequest.accountType === "family") {
      // Create parent user
      userId = uuidv4();
      const parentUser = await storage.createUser({
        id: userId,
        email: signupRequest.email,
        firstName: signupRequest.firstName,
        lastName: signupRequest.lastName,
        role: "parent",
        tenantId: signupRequest.tenantId,
        phone: signupRequest.phone,
        isActive: true,
      });

      // Set password separately (assuming this method exists)
      await storage.setUserPassword(userId, signupRequest.hashedPassword);

      // Create family account
      familyAccountId = uuidv4();
      const familyAccount = await storage.createFamilyAccount({
        id: familyAccountId,
        parentId: userId,
        familyName: `${signupRequest.firstName} ${signupRequest.lastName} Family`,
        subscriptionPlan: "family",
        maxChildren: 5,
        isActive: true,
      });

      // Create child profile
      const childData = signupRequest.childData as any;
      if (childData) {
        const childProfileId = uuidv4();
        await storage.createChildProfile({
          id: childProfileId,
          familyAccountId,
          firstName: childData.firstName,
          lastName: childData.lastName,
          birthDate: childData.birthDate,
          gradeLevel: childData.gradeLevel,
          isActive: true,
        });
      }

    } else {
      // Create individual user account
      userId = uuidv4();
      const role = signupRequest.accountType === "student" ? "student_elementary" : 
                   signupRequest.accountType === "tutor" ? "teacher" : "parent";

      const user = await storage.createUser({
        id: userId,
        email: signupRequest.email,
        firstName: signupRequest.firstName,
        lastName: signupRequest.lastName,
        role,
        tenantId: signupRequest.tenantId,
        phone: signupRequest.phone || signupRequest.parentPhone,
        gradeLevel: signupRequest.gradeLevel,
        isActive: true,
      });

      // Set password separately
      await storage.setUserPassword(userId, signupRequest.hashedPassword);
    }

    // Mark signup request as verified
    await storage.updateSignupRequest(signupRequestId, {
      isVerified: true,
    });

    res.json({
      message: "Account created successfully",
      userId,
      familyAccountId,
      accountType: signupRequest.accountType,
    });

  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// School demo request
router.post("/school-demo", async (req, res) => {
  try {
    const validatedData = schoolDemoRequestValidationSchema.parse(req.body);
    
    // Check for duplicate requests from same email
    const existingRequest = await storage.getSchoolDemoRequestByEmail(validatedData.email);
    if (existingRequest && existingRequest.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
      return res.status(400).json({ 
        error: "A demo request from this email was already submitted within the last 7 days" 
      });
    }

    // Determine priority based on school size and timeline
    let priority = "medium";
    if (validatedData.studentPopulation === "over-2000" || 
        validatedData.timeline === "immediate" || 
        validatedData.budget === "over-100k") {
      priority = "high";
    } else if (validatedData.studentPopulation === "under-100" || 
               validatedData.timeline === "exploring") {
      priority = "low";
    }

    // Create demo request
    const demoRequestId = uuidv4();
    const demoRequest = await storage.createSchoolDemoRequest({
      id: demoRequestId,
      schoolName: validatedData.schoolName,
      contactName: validatedData.contactName,
      email: validatedData.email,
      phone: validatedData.phone,
      role: validatedData.role,
      schoolType: validatedData.schoolType,
      location: validatedData.location,
      studentPopulation: validatedData.studentPopulation,
      gradeRange: validatedData.gradeRange,
      hasComputerLab: validatedData.hasComputerLab,
      currentTechnology: validatedData.currentTechnology,
      curriculum: validatedData.curriculum,
      painPoints: validatedData.painPoints,
      budget: validatedData.budget,
      timeline: validatedData.timeline,
      status: "pending",
      priority,
    });

    // TODO: Send notification to sales team
    // TODO: Send confirmation email to requester

    res.json({
      message: "Demo request submitted successfully",
      requestId: demoRequestId,
      priority,
      estimatedContactTime: priority === "high" ? "within 24 hours" : "within 1-2 business days",
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", details: error.errors });
    }
    console.error("School demo request error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Resend verification code
router.post("/resend-verification", async (req, res) => {
  try {
    const { signupRequestId } = req.body;

    if (!signupRequestId) {
      return res.status(400).json({ error: "Signup request ID required" });
    }

    // Get signup request
    const signupRequest = await storage.getSignupRequest(signupRequestId);
    if (!signupRequest) {
      return res.status(404).json({ error: "Signup request not found" });
    }

    // Check if request has expired
    if (new Date() > signupRequest.expiresAt) {
      return res.status(400).json({ error: "Signup request has expired" });
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    
    // Get the contact method
    const contactMethod = signupRequest.phone || signupRequest.parentPhone;
    if (!contactMethod) {
      return res.status(400).json({ error: "No phone number found for verification" });
    }

    // Create new verification request
    await storage.createVerificationRequest({
      id: uuidv4(),
      userId: signupRequestId,
      verificationType: signupRequest.parentPhone ? "parent_phone" : "phone",
      contactMethod,
      verificationCode,
      isVerified: false,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    });

    // Send verification SMS
    const message = signupRequest.parentPhone ? 
      `Your child is trying to create an account. Use this code to verify:` :
      `Your verification code is:`;
    
    await sendVerificationSMS(contactMethod, verificationCode, message);

    res.json({
      message: "New verification code sent",
      phone: contactMethod.replace(/(\d{3})\d{3}(\d{4})/, "$1***$2"),
    });

  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router as signupRoutes };