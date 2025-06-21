import { useState } from "react";

export interface CBEFeature {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  highlight?: string;
  iconColor: string;
  bgColor: string;
}

export interface CBEBenefit {
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface CBEStats {
  title: string;
  value: string;
  description: string;
  icon: string;
  color: string;
}

export const CBE_KEY_FEATURES: CBEFeature[] = [
  {
    icon: "BookOpen",
    title: "Curriculum-Aligned",
    subtitle: "All resources pre-mapped to CBE strands & sub-strands.",
    description: "Our AI automatically tags content to your grade's competencies.",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    icon: "BarChart3",
    title: "Real-Time Analytics",
    subtitle: "Track individual and class competency mastery",
    description: "Identify learning gaps before exams with our dashboard.",
    highlight: "Data-Driven Teaching",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    icon: "Wifi",
    title: "Africa-Ready",
    subtitle: "Works offline and on low-bandwidth connections",
    description: "Full functionality via LAN or mobile data",
    highlight: "No Internet? No Problem",
    iconColor: "text-green-600",
    bgColor: "bg-green-50"
  }
];

export const CBE_BENEFITS: CBEBenefit[] = [
  {
    title: "Competency-Based Assessment",
    description: "Track student progress through specific learning outcomes",
    icon: "Target",
    color: "bg-blue-600"
  },
  {
    title: "Holistic Development",
    description: "Focus on knowledge, skills, and values development",
    icon: "Users",
    color: "bg-green-600"
  },
  {
    title: "Continuous Evaluation",
    description: "Ongoing assessment rather than high-stakes testing",
    icon: "TrendingUp",
    color: "bg-purple-600"
  },
  {
    title: "Real-World Application",
    description: "Learning experiences connected to everyday life",
    icon: "Rocket",
    color: "bg-orange-600"
  },
  {
    title: "Individual Pacing",
    description: "Students progress at their own learning speed",
    icon: "Clock",
    color: "bg-indigo-600"
  },
  {
    title: "Digital Integration",
    description: "Technology-enhanced learning experiences",
    icon: "Settings",
    color: "bg-blue-600"
  }
];

export const CBE_IMPACT_STATS: CBEStats[] = [
  {
    title: "Schools Using CBE",
    value: "25,000+",
    description: "Across Kenya implementing competency-based curriculum",
    icon: "School",
    color: "bg-blue-600"
  },
  {
    title: "Student Engagement",
    value: "85%",
    description: "Increase in active learning participation",
    icon: "TrendingUp",
    color: "bg-green-600"
  },
  {
    title: "Teacher Satisfaction",
    value: "92%",
    description: "Report improved teaching effectiveness",
    icon: "Award",
    color: "bg-purple-600"
  },
  {
    title: "Learning Outcomes",
    value: "78%",
    description: "Improvement in critical thinking skills",
    icon: "Target",
    color: "bg-orange-600"
  }
];

export function useCBEOverview() {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [selectedFeature, setSelectedFeature] = useState<CBEFeature | null>(null);

  const navigateToSection = (section: string) => {
    setActiveSection(section);
    // Smooth scroll to section
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const selectFeature = (feature: CBEFeature) => {
    setSelectedFeature(feature);
  };

  const closeFeatureModal = () => {
    setSelectedFeature(null);
  };

  return {
    // State
    activeSection,
    selectedFeature,
    
    // Data
    keyFeatures: CBE_KEY_FEATURES,
    benefits: CBE_BENEFITS,
    impactStats: CBE_IMPACT_STATS,
    
    // Actions
    setActiveSection,
    navigateToSection,
    selectFeature,
    closeFeatureModal,
  };
}