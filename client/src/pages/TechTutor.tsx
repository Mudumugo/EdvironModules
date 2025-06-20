import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  BookOpen, 
  Video, 
  Users, 
  MessageSquare, 
  Star,
  Play,
  Clock,
  Award
} from "lucide-react";

const tutorialCategories = [
  {
    id: 'basics',
    title: 'Computer Basics',
    description: 'Learn fundamental computer skills',
    icon: '💻',
    color: 'bg-blue-500',
    tutorials: [
      'How to use mouse and keyboard',
      'Understanding the desktop',
      'Opening and closing programs',
      'File management basics'
    ]
  },
  {
    id: 'internet',
    title: 'Internet Skills',
    description: 'Navigate the web safely and effectively',
    icon: '🌐',
    color: 'bg-green-500',
    tutorials: [
      'Using web browsers',
      'Searching effectively',
      'Email basics',
      'Online safety tips'
    ]
  },
  {
    id: 'digital_citizenship',
    title: 'Digital Citizenship',
    description: 'Be a responsible digital citizen',
    icon: '🛡️',
    color: 'bg-purple-500',
    tutorials: [
      'Privacy settings',
      'Cyberbullying prevention',
      'Digital footprint awareness',
      'Respectful online communication'
    ]
  },
  {
    id: 'study_tools',
    title: 'Study Tools',
    description: 'Use technology to enhance learning',
    icon: '📚',
    color: 'bg-orange-500',
    tutorials: [
      'Digital note-taking',
      'Online research methods',
      'Collaboration tools',
      'Time management apps'
    ]
  }
];

const aiAssistant = {
  name: 'TechTutor AI',
  avatar: '🤖',
  status: 'online',
  specialties: ['Computer Skills', 'Internet Safety', 'Digital Tools', 'Study Tips']
};

export default function TechTutor() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl">
              🤖
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tech Tutor</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Your friendly AI assistant for learning technology skills
            </p>
          </div>
        </div>

        {/* AI Assistant Card */}
        <Card className="border-2 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-2xl">
                {aiAssistant.avatar}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{aiAssistant.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-500">{aiAssistant.status}</span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Hi there! I'm here to help you learn technology skills step by step. 
                Ask me anything about computers, internet safety, or digital tools!
              </p>
              
              <div className="flex flex-wrap gap-2">
                {aiAssistant.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-3">
                <Button className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Ask TechTutor
                </Button>
                <Button variant="outline">
                  <Video className="h-4 w-4 mr-2" />
                  Video Call
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tutorial Categories */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Learning Categories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tutorialCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center text-2xl`}>
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{category.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {category.description}
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.tutorials.map((tutorial, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Play className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">{tutorial}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">5-10 min</span>
                        </div>
                      </div>
                    ))}
                    
                    <Button variant="outline" className="w-full mt-4">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Start Learning
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Help Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Quick Help & Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Bot className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <h4 className="font-medium mb-1">AI Chat Support</h4>
                <p className="text-xs text-gray-500 mb-3">Get instant help from our AI tutor</p>
                <Button size="sm" variant="outline" className="w-full">
                  Start Chat
                </Button>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Video className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <h4 className="font-medium mb-1">Video Tutorials</h4>
                <p className="text-xs text-gray-500 mb-3">Watch step-by-step guides</p>
                <Button size="sm" variant="outline" className="w-full">
                  Browse Videos
                </Button>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Award className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <h4 className="font-medium mb-1">Practice Exercises</h4>
                <p className="text-xs text-gray-500 mb-3">Test your knowledge</p>
                <Button size="sm" variant="outline" className="w-full">
                  Try Exercises
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}