import { storage } from "./storage";

export async function seedCRMData() {
  console.log("Seeding CRM data...");
  
  try {
    // Sample leads data
    const sampleLeads = [
      {
        first_name: "Mary",
        last_name: "Wanjiku", 
        email: "mary.wanjiku@email.com",
        phone: "+254712345678",
        age: 16,
        account_type: "individual",
        interests: ["Mathematics", "Science"],
        location: "Nairobi, Westlands, Parklands",
        source: "website",
        status: "new",
        priority: "high",
        notes: "Interested in STEM subjects, parent contact required",
        tenant_id: "default",
      },
      {
        first_name: "John",
        last_name: "Kamau", 
        email: "j.kamau@family.com",
        phone: "+254723456789",
        age: 35,
        account_type: "family",
        interests: ["Primary Education", "Secondary Education"],
        location: "Kiambu, Thika Town, Township",
        source: "website",
        status: "contacted",
        priority: "medium",
        notes: "Father of 3 children, looking for comprehensive family package",
        tenant_id: "default",
      },
      {
        first_name: "Grace",
        last_name: "Muthoni",
        email: "grace.muthoni@school.ac.ke",
        phone: "+254734567890",
        age: 45,
        account_type: "school",
        interests: ["School Management", "Digital Library"],
        location: "Nakuru, Nakuru Town East, Biashara",
        source: "referral",
        status: "qualified",
        priority: "high",
        notes: "Head teacher at primary school with 200+ students",
        tenant_id: "default",
      },
      {
        first_name: "Peter",
        last_name: "Ochieng",
        email: "peter.ochieng@student.com",
        phone: "+254745678901",
        age: 18,
        account_type: "individual",
        interests: ["University Prep", "Engineering"],
        location: "Kisumu, Kisumu Central, Market Milimani",
        source: "social",
        status: "new",
        priority: "medium",
        notes: "Form 4 student preparing for university entrance",
        tenant_id: "default",
      },
      {
        first_name: "Sarah",
        last_name: "Njeri",
        email: "sarah.njeri@gmail.com",
        phone: "+254756789012",
        age: 28,
        account_type: "family",
        interests: ["Early Learning", "Parental Guidance"],
        location: "Meru, Igembe South, Maua",
        source: "website",
        status: "lost",
        priority: "low",
        notes: "Initial interest but price concerns for family package",
        tenant_id: "default",
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
        number_of_students: 5000,
        preferred_date: new Date("2025-07-15"),
        preferred_time: "10:00 AM",
        message: "Interested in platform-wide implementation for county schools",
        status: "pending",
        tenant_id: "default",
      },
      {
        first_name: "Jane",
        last_name: "Mbugua",
        email: "jane.mbugua@school.edu",
        phone: "+254778901234",
        organization: "Nairobi Academy",
        role: "ICT Coordinator",
        number_of_students: 800,
        preferred_date: new Date("2025-07-20"),
        preferred_time: "2:00 PM",
        message: "Looking for digital learning solution for secondary school",
        status: "scheduled",
        scheduled_date: new Date("2025-07-20T14:00:00Z"),
        tenant_id: "default",
      },
      {
        first_name: "Robert",
        last_name: "Kiprotich",
        email: "rkirotich@university.edu",
        phone: "+254789012345",
        organization: "Moi University",
        role: "Dean of Education",
        number_of_students: 2000,
        preferred_date: new Date("2025-07-25"),
        preferred_time: "11:00 AM", 
        message: "Exploring educational technology for teacher training programs",
        status: "completed",
        completed_date: new Date("2025-06-15T11:00:00Z"),
        tenant_id: "default",
      }
    ];

    // Create demo requests
    for (const demoData of sampleDemos) {
      await storage.createDemoRequest(demoData);
    }

    // Sample activities for the first lead
    const sampleActivities = [
      {
        lead_id: 1,
        type: "call",
        subject: "Initial contact call",
        description: "Called to discuss student's interest in mathematics and science tutoring. Parent Mrs. Wanjiku answered and showed strong interest.",
        outcome: "successful",
        created_by: "sales-rep-1",
        tenant_id: "default",
      },
      {
        lead_id: 1,
        type: "email",
        subject: "Follow-up with pricing information",
        description: "Sent detailed pricing for individual student package including access to STEM resources and virtual tutoring sessions.",
        outcome: "sent",
        created_by: "sales-rep-1", 
        tenant_id: "default",
      },
      {
        lead_id: 2,
        type: "meeting",
        subject: "Family package consultation",
        description: "Video call with Mr. Kamau to discuss family package options for his three children in different grade levels.",
        outcome: "successful",
        scheduled_date: new Date("2025-06-16T10:00:00Z"),
        completed_date: new Date("2025-06-16T10:30:00Z"),
        created_by: "sales-rep-2",
        tenant_id: "default",
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