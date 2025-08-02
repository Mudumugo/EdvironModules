import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import edvironsLogo from "@assets/edv-main-logo_1754150677721.png";
import { BookOpen, Target, Users, CheckCircle, Award, TrendingUp } from "lucide-react";

export default function CbeOverview() {
  const cbeFeatures = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Curriculum Alignment",
      description: "100% aligned with Kenya's Competency-Based Curriculum framework and learning outcomes."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Competency Assessment",
      description: "Tools for assessing and tracking student competencies across all learning areas."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Learner-Centered Approach",
      description: "Focus on individual learner needs with personalized learning paths and resources."
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Continuous Assessment",
      description: "Ongoing evaluation tools that support formative and summative assessment practices."
    }
  ];

  const learningAreas = [
    { name: "Languages", description: "English, Kiswahili, Kenyan Sign Language" },
    { name: "Mathematics", description: "Mathematical concepts and problem-solving skills" },
    { name: "Environmental Activities", description: "Science, Social Studies, and Environmental awareness" },
    { name: "Hygiene & Nutrition", description: "Health education and nutrition awareness" },
    { name: "Creative Arts", description: "Music, Art & Craft, and Physical Education" },
    { name: "Religious Education", description: "Christian/Islamic/Hindu Religious Education" }
  ];

  const competencies = [
    "Communication and Collaboration",
    "Critical Thinking and Problem Solving",
    "Imagination and Creativity",
    "Citizenship",
    "Digital Literacy",
    "Learning to Learn",
    "Self-Efficacy"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <nav className="relative z-50 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <img src={edvironsLogo} alt="EdVirons" className="h-12 w-auto" />
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" className="border-gray-400 text-gray-200 hover:bg-gray-700">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">Competency-Based Education (CBE) Overview</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              EdVirons is fully aligned with Kenya's Competency-Based Curriculum, supporting the transformation of education to develop well-rounded learners.
            </p>
          </div>

          {/* CBE Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {cbeFeatures.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/15 transition-colors">
                <div className="text-orange-500 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* What is CBE Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">What is Competency-Based Education?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-300 mb-4">
                  Competency-Based Education (CBE) is an educational approach that focuses on developing specific competencies and skills in learners rather than just knowledge acquisition. The Kenyan CBE framework emphasizes:
                </p>
                <ul className="text-gray-300 space-y-2">
                  <li>• Learner-centered teaching approaches</li>
                  <li>• Development of 21st-century skills</li>
                  <li>• Integration of values and character building</li>
                  <li>• Assessment for learning rather than assessment of learning</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Key Benefits</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Develops critical thinking and problem-solving skills</li>
                  <li>• Promotes creativity and innovation</li>
                  <li>• Enhances communication and collaboration</li>
                  <li>• Prepares learners for the digital age</li>
                  <li>• Builds strong moral and ethical foundations</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Learning Areas */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Learning Areas</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningAreas.map((area, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">{area.name}</h3>
                  <p className="text-gray-300">{area.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Core Competencies */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Core Competencies</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {competencies.map((competency, index) => (
                <div key={index} className="flex items-center bg-white/5 rounded-lg p-4">
                  <Award className="h-6 w-6 text-orange-500 mr-3 flex-shrink-0" />
                  <span className="text-white font-medium">{competency}</span>
                </div>
              ))}
            </div>
          </div>

          {/* EdVirons CBE Support */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">How EdVirons Supports CBE</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">For Teachers</h3>
                <ul className="text-gray-300 space-y-3">
                  <li className="flex items-start">
                    <TrendingUp className="h-5 w-5 text-orange-500 mr-2 mt-1 flex-shrink-0" />
                    Lesson planning tools aligned with CBC learning outcomes
                  </li>
                  <li className="flex items-start">
                    <TrendingUp className="h-5 w-5 text-orange-500 mr-2 mt-1 flex-shrink-0" />
                    Assessment rubrics for competency evaluation
                  </li>
                  <li className="flex items-start">
                    <TrendingUp className="h-5 w-5 text-orange-500 mr-2 mt-1 flex-shrink-0" />
                    Digital resources and teaching materials
                  </li>
                  <li className="flex items-start">
                    <TrendingUp className="h-5 w-5 text-orange-500 mr-2 mt-1 flex-shrink-0" />
                    Professional development modules on CBC implementation
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">For Learners</h3>
                <ul className="text-gray-300 space-y-3">
                  <li className="flex items-start">
                    <TrendingUp className="h-5 w-5 text-orange-500 mr-2 mt-1 flex-shrink-0" />
                    Interactive learning activities and simulations
                  </li>
                  <li className="flex items-start">
                    <TrendingUp className="h-5 w-5 text-orange-500 mr-2 mt-1 flex-shrink-0" />
                    Personalized learning paths based on competency levels
                  </li>
                  <li className="flex items-start">
                    <TrendingUp className="h-5 w-5 text-orange-500 mr-2 mt-1 flex-shrink-0" />
                    Digital portfolios to showcase learning progress
                  </li>
                  <li className="flex items-start">
                    <TrendingUp className="h-5 w-5 text-orange-500 mr-2 mt-1 flex-shrink-0" />
                    Collaborative tools for peer learning and group projects
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Assessment Methods */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Assessment in CBE</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-orange-500 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Formative Assessment</h3>
                <p className="text-gray-300">Ongoing assessment during learning to provide feedback and guide instruction.</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-500 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Summative Assessment</h3>
                <p className="text-gray-300">Evaluation at the end of learning periods to measure achievement of competencies.</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-500 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Competency Tracking</h3>
                <p className="text-gray-300">Continuous monitoring of learner progress across all core competencies.</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-white mb-6">Ready to Implement CBE in Your School?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Discover how EdVirons can help you successfully transition to and implement the Competency-Based Curriculum.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg">
                  Schedule CBE Demo
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="outline" className="border-gray-400 text-gray-200 hover:bg-gray-700 px-8 py-3 text-lg">
                  Explore Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}