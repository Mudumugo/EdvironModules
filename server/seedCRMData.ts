import { storage } from "./storage";

export async function seedCRMData() {
  console.log("Seeding CRM data...");
  
  try {
    // Sample leads data
    const sampleLeads = [
      {
        firstName: "Mary",
        lastName: "Wanjiku", 
        email: "mary.wanjiku@email.com",
        phone: "+254712345678",
        age: 16,
        accountType: "individual",
        interests: ["Mathematics", "Science"],
        location: "Nairobi, Westlands, Parklands",
        source: "website",
        status: "new",
        priority: "high",
        notes: "Interested in STEM subjects, parent contact required",
        tenantId: "default",
      },
      {
        firstName: "John",
        lastName: "Kamau", 
        email: "j.kamau@family.com",
        phone: "+254723456789",
        age: 35,
        accountType: "family",
        interests: ["Primary Education", "Secondary Education"],
        location: "Kiambu, Thika Town, Township",
        source: "website",
        status: "contacted",
        priority: "medium",
        notes: "Father of 3 children, looking for comprehensive family package",
        tenantId: "default",
      },
      {
        firstName: "Grace",
        lastName: "Muthoni",
        email: "grace.muthoni@school.ac.ke",
        phone: "+254734567890",
        age: 45,
        accountType: "school",
        interests: ["School Management", "Digital Library"],
        location: "Nakuru, Nakuru Town East, Biashara",
        source: "referral",
        status: "qualified",
        priority: "high",
        notes: "Head teacher at primary school with 200+ students",
        tenantId: "default",
      },
      {
        firstName: "Peter",
        lastName: "Ochieng",
        email: "peter.ochieng@student.com",
        phone: "+254745678901",
        age: 18,
        accountType: "individual",
        interests: ["University Prep", "Engineering"],
        location: "Kisumu, Kisumu Central, Market Milimani",
        source: "social",
        status: "new",
        priority: "medium",
        notes: "Form 4 student preparing for university entrance",
        tenantId: "default",
      },
      {
        firstName: "Sarah",
        lastName: "Njeri",
        email: "sarah.njeri@gmail.com",
        phone: "+254756789012",
        age: 28,
        accountType: "family",
        interests: ["Early Learning", "Parental Guidance"],
        location: "Meru, Igembe South, Maua",
        source: "website",
        status: "lost",
        priority: "low",
        notes: "Initial interest but price concerns for family package",
        tenantId: "default",
      }
    ];

    // Create leads
    for (const leadData of sampleLeads) {
      await storage.createLead(leadData);
    }

    // Sample demo requests
    const sampleDemos = [
      {
        firstName: "Dr. Michael",
        lastName: "Waweru",
        email: "mwaweru@education.go.ke",
        phone: "+254767890123",
        organization: "County Education Office",
        role: "County Director of Education",
        numberOfStudents: 5000,
        preferredDate: new Date("2025-07-15"),
        preferredTime: "10:00 AM",
        message: "Interested in platform-wide implementation for county schools",
        status: "pending",
        tenantId: "default",
      },
      {
        firstName: "Jane",
        lastName: "Mbugua",
        email: "jane.mbugua@school.edu",
        phone: "+254778901234",
        organization: "Nairobi Academy",
        role: "ICT Coordinator",
        numberOfStudents: 800,
        preferredDate: new Date("2025-07-20"),
        preferredTime: "2:00 PM",
        message: "Looking for digital learning solution for secondary school",
        status: "scheduled",
        scheduledDate: new Date("2025-07-20T14:00:00Z"),
        tenantId: "default",
      },
      {
        firstName: "Robert",
        lastName: "Kiprotich",
        email: "rkirotich@university.edu",
        phone: "+254789012345",
        organization: "Moi University",
        role: "Dean of Education",
        numberOfStudents: 2000,
        preferredDate: new Date("2025-07-25"),
        preferredTime: "11:00 AM", 
        message: "Exploring educational technology for teacher training programs",
        status: "completed",
        completedDate: new Date("2025-06-15T11:00:00Z"),
        tenantId: "default",
      }
    ];

    // Create demo requests
    for (const demoData of sampleDemos) {
      await storage.createDemoRequest(demoData);
    }

    // Sample activities for the first lead
    const sampleActivities = [
      {
        leadId: 1,
        type: "call",
        subject: "Initial contact call",
        description: "Called to discuss student's interest in mathematics and science tutoring. Parent Mrs. Wanjiku answered and showed strong interest.",
        outcome: "successful",
        createdBy: "sales-rep-1",
        tenantId: "default",
      },
      {
        leadId: 1,
        type: "email",
        subject: "Follow-up with pricing information",
        description: "Sent detailed pricing for individual student package including access to STEM resources and virtual tutoring sessions.",
        outcome: "sent",
        createdBy: "sales-rep-1", 
        tenantId: "default",
      },
      {
        leadId: 2,
        type: "meeting",
        subject: "Family package consultation",
        description: "Video call with Mr. Kamau to discuss family package options for his three children in different grade levels.",
        outcome: "successful",
        scheduledDate: new Date("2025-06-16T10:00:00Z"),
        completedDate: new Date("2025-06-16T10:30:00Z"),
        createdBy: "sales-rep-2",
        tenantId: "default",
      }
    ];

    // Create activities
    for (const activityData of sampleActivities) {
      await storage.createLeadActivity(activityData);
    }

    console.log("CRM data seeded successfully!");
    console.log(`Created ${sampleLeads.length} leads, ${sampleDemos.length} demo requests, and ${sampleActivities.length} activities`);
    
  } catch (error) {
    console.error("Error seeding CRM data:", error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedCRMData().then(() => process.exit(0));
}