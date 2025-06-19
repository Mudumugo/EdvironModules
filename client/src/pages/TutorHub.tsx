import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap } from "lucide-react";
import { TutorStats, TutorFilters, TutorGrid, type Tutor } from "@/components/tutor/modules";

const mockTutors: Tutor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    avatar: "/api/placeholder/100/100",
    subjects: ["Mathematics", "Physics", "Calculus"],
    rating: 4.9,
    experience: "8 years",
    hourlyRate: "$45",
    languages: ["English", "Spanish"],
    availability: "Available now",
    verified: true,
    featured: true,
    responseTime: "< 1 hour",
    lessonsCompleted: 234,
    description: "Experienced mathematics tutor with PhD in Applied Mathematics. Specializes in helping students understand complex mathematical concepts through practical examples.",
    specializations: ["Advanced Calculus", "Linear Algebra", "Statistics"],
    education: "PhD in Applied Mathematics, MIT",
    teachingStyle: ["Visual Learning", "Problem-Based", "Interactive"],
    sessionTypes: ["One-on-One", "Group Sessions", "Homework Help"]
  },
  {
    id: "2",
    name: "Prof. Michael Chen",
    avatar: "/api/placeholder/100/100",
    subjects: ["Computer Science", "Programming", "Web Development"],
    rating: 4.8,
    experience: "12 years",
    hourlyRate: "$60",
    languages: ["English", "Mandarin"],
    availability: "Available today",
    verified: true,
    featured: true,
    responseTime: "< 30 min",
    lessonsCompleted: 456,
    description: "Senior software engineer and computer science professor. Expert in full-stack development, algorithms, and data structures.",
    specializations: ["JavaScript", "Python", "React", "Node.js"],
    education: "MS Computer Science, Stanford University",
    teachingStyle: ["Hands-on Coding", "Project-Based", "Real-world Examples"],
    sessionTypes: ["Code Review", "Project Mentoring", "Technical Interviews"]
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    avatar: "/api/placeholder/100/100",
    subjects: ["Spanish", "Literature", "Writing"],
    rating: 4.7,
    experience: "6 years",
    hourlyRate: "$35",
    languages: ["English", "Spanish", "French"],
    availability: "Available this week",
    verified: true,
    featured: false,
    responseTime: "< 2 hours",
    lessonsCompleted: 189,
    description: "Native Spanish speaker with extensive experience teaching language and literature. Passionate about helping students develop fluency.",
    specializations: ["Conversational Spanish", "Grammar", "Creative Writing"],
    education: "BA Spanish Literature, Universidad de Barcelona",
    teachingStyle: ["Conversational", "Cultural Immersion", "Grammar Focus"],
    sessionTypes: ["Conversation Practice", "Exam Prep", "Cultural Studies"]
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    avatar: "/api/placeholder/100/100",
    subjects: ["Chemistry", "Biology", "Environmental Science"],
    rating: 4.6,
    experience: "10 years",
    hourlyRate: "$50",
    languages: ["English"],
    availability: "Available tomorrow",
    verified: true,
    featured: false,
    responseTime: "< 3 hours",
    lessonsCompleted: 312,
    description: "Research scientist and educator with expertise in environmental chemistry and molecular biology.",
    specializations: ["Organic Chemistry", "Biochemistry", "Environmental Analysis"],
    education: "PhD Chemistry, Harvard University",
    teachingStyle: ["Laboratory Examples", "Visual Models", "Research-Based"],
    sessionTypes: ["Lab Assistance", "Research Guidance", "Exam Preparation"]
  },
  {
    id: "5",
    name: "Lisa Thompson",
    avatar: "/api/placeholder/100/100",
    subjects: ["English", "SAT Prep", "Essay Writing"],
    rating: 4.8,
    experience: "7 years",
    hourlyRate: "$40",
    languages: ["English"],
    availability: "Available now",
    verified: true,
    featured: false,
    responseTime: "< 1 hour",
    lessonsCompleted: 267,
    description: "English teacher and test prep specialist. Helped hundreds of students improve their SAT scores and writing skills.",
    specializations: ["SAT Reading", "College Essays", "Grammar", "Literature Analysis"],
    education: "MA English Education, Columbia University",
    teachingStyle: ["Structured Learning", "Practice Tests", "Feedback-Rich"],
    sessionTypes: ["Test Prep", "Essay Review", "Reading Comprehension"]
  }
];

export default function TutorHub() {
  const { toast } = useToast();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedRating, setSelectedRating] = useState(0);
  const [priceRange, setPriceRange] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const { data: tutors, isLoading } = useQuery({
    queryKey: ["/api/tutors"],
    queryFn: () => Promise.resolve(mockTutors),
  });

  const typedTutors = (tutors || []) as Tutor[];

  // Extract unique values for filters
  const subjects = Array.from(new Set(typedTutors.flatMap(tutor => tutor.subjects)));
  const languages = Array.from(new Set(typedTutors.flatMap(tutor => tutor.languages)));

  // Filter tutors based on current filter state
  const filteredTutors = typedTutors.filter((tutor: Tutor) => {
    const matchesSearch = searchTerm === "" || 
      tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      tutor.specializations.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSubject = selectedSubject === "all" || 
      tutor.subjects.some(subject => subject === selectedSubject);

    const matchesRating = selectedRating === 0 || tutor.rating >= selectedRating;

    const matchesPrice = priceRange === "all" || (() => {
      const price = parseInt(tutor.hourlyRate.replace('$', ''));
      switch (priceRange) {
        case "10-20": return price >= 10 && price <= 20;
        case "20-50": return price >= 20 && price <= 50;
        case "50-100": return price >= 50 && price <= 100;
        case "100+": return price >= 100;
        default: return true;
      }
    })();

    const matchesAvailability = availability === "all" || (() => {
      switch (availability) {
        case "now": return tutor.availability.includes("now");
        case "today": return tutor.availability.includes("today") || tutor.availability.includes("now");
        case "week": return true; // Assume all tutors are available within a week
        default: return true;
      }
    })();

    const matchesLanguages = selectedLanguages.length === 0 ||
      selectedLanguages.some(lang => tutor.languages.includes(lang));

    return matchesSearch && matchesSubject && matchesRating && matchesPrice && matchesAvailability && matchesLanguages;
  });

  // Calculate stats
  const totalTutors = typedTutors.length;
  const averageRating = typedTutors.length > 0 
    ? (typedTutors.reduce((sum, tutor) => sum + tutor.rating, 0) / typedTutors.length).toFixed(1)
    : "0";
  const totalSessions = typedTutors.reduce((sum, tutor) => sum + tutor.lessonsCompleted, 0);
  const activeNow = typedTutors.filter(tutor => tutor.availability.includes("now")).length;

  const featuredTutors = typedTutors.filter(tutor => tutor.featured);

  const handleBookSession = (tutorId: string) => {
    toast({
      title: "Session Booking",
      description: "Session booking functionality will be implemented soon.",
    });
  };

  const handleSendMessage = (tutorId: string) => {
    toast({
      title: "Message Sent",
      description: "Message functionality will be implemented soon.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading tutors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="flex justify-center items-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Tutor Hub
          </h1>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Connect with expert tutors for personalized learning experiences. Get help with homework, test prep, and skill development.
          </p>
        </div>

        {/* Stats */}
        <TutorStats
          totalTutors={totalTutors}
          averageRating={parseFloat(averageRating)}
          totalSessions={totalSessions}
          activeNow={activeNow}
        />

        {/* Filters */}
        <TutorFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
          selectedRating={selectedRating}
          setSelectedRating={setSelectedRating}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          availability={availability}
          setAvailability={setAvailability}
          languages={languages}
          selectedLanguages={selectedLanguages}
          setSelectedLanguages={setSelectedLanguages}
          subjects={subjects}
        />

        {/* Featured Tutors */}
        {featuredTutors.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-4">Featured Tutors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TutorGrid
                tutors={featuredTutors}
                isLoading={false}
                onBookSession={handleBookSession}
                onSendMessage={handleSendMessage}
              />
            </div>
          </div>
        )}

        {/* All Tutors */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
            {selectedSubject === "all" ? "All Tutors" : `${selectedSubject} Tutors`} 
            ({filteredTutors.length})
          </h2>
          <TutorGrid
            tutors={filteredTutors}
            isLoading={isLoading}
            onBookSession={handleBookSession}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
}