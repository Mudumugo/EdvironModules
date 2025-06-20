import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  BookOpen, 
  MessageSquare, 
  Phone, 
  Mail, 
  HelpCircle,
  ChevronRight,
  Star,
  Clock,
  Users,
  Video,
  FileText,
  Lightbulb
} from "lucide-react";

const helpCategories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'New to Edvirons? Start here',
    icon: '🚀',
    color: 'bg-blue-500',
    articles: 12
  },
  {
    id: 'digital-library',
    title: 'Digital Library',
    description: 'Find and access resources',
    icon: '📚',
    color: 'bg-green-500',
    articles: 8
  },
  {
    id: 'my-locker',
    title: 'My Locker',
    description: 'Organize your content',
    icon: '🗂️',
    color: 'bg-purple-500',
    articles: 6
  },
  {
    id: 'apps-hub',
    title: 'Apps Hub',
    description: 'Use educational apps',
    icon: '🎯',
    color: 'bg-orange-500',
    articles: 10
  },
  {
    id: 'tech-support',
    title: 'Technical Issues',
    description: 'Solve technical problems',
    icon: '🔧',
    color: 'bg-red-500',
    articles: 15
  },
  {
    id: 'account',
    title: 'Account & Settings',
    description: 'Manage your account',
    icon: '⚙️',
    color: 'bg-gray-500',
    articles: 7
  }
];

const popularArticles = [
  {
    id: 1,
    title: 'How to access the Digital Library',
    category: 'Digital Library',
    views: 1250,
    helpful: 95,
    timeToRead: '3 min'
  },
  {
    id: 2,
    title: 'Creating and organizing notebooks in My Locker',
    category: 'My Locker',
    views: 980,
    helpful: 92,
    timeToRead: '5 min'
  },
  {
    id: 3,
    title: 'Getting started with Edvirons Portal',
    category: 'Getting Started',
    views: 2100,
    helpful: 98,
    timeToRead: '7 min'
  },
  {
    id: 4,
    title: 'Using educational apps in Apps Hub',
    category: 'Apps Hub',
    views: 750,
    helpful: 89,
    timeToRead: '4 min'
  }
];

const contactOptions = [
  {
    type: 'chat',
    title: 'Live Chat',
    description: 'Chat with our support team',
    availability: 'Available 24/7',
    icon: MessageSquare,
    color: 'bg-blue-500'
  },
  {
    type: 'email',
    title: 'Email Support',
    description: 'Send us an email',
    availability: 'Response within 24 hours',
    icon: Mail,
    color: 'bg-green-500'
  },
  {
    type: 'phone',
    title: 'Phone Support',
    description: 'Call our helpline',
    availability: 'Mon-Fri 9AM-5PM',
    icon: Phone,
    color: 'bg-purple-500'
  },
  {
    type: 'video',
    title: 'Video Call',
    description: 'Schedule a video session',
    availability: 'By appointment',
    icon: Video,
    color: 'bg-orange-500'
  }
];

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-4xl">
              🆘
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Help Center</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Find answers to your questions and get the support you need
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for help articles, guides, and FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 text-lg"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-sm text-gray-500">Popular searches:</span>
              {['login issues', 'digital library', 'my locker', 'apps hub'].map((term) => (
                <Button key={term} variant="outline" size="sm" className="text-xs">
                  {term}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Help Categories */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Browse by Category
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {helpCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center text-2xl flex-shrink-0`}>
                        {category.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {category.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {category.description}
                        </p>
                        <Badge variant="secondary" className="mt-2 text-xs">
                          {category.articles} articles
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Popular Articles */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Popular Help Articles
          </h2>
          
          <div className="space-y-4">
            {popularArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <FileText className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>{article.category}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {article.timeToRead}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {article.views} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            {article.helpful}% helpful
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Contact Support
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contactOptions.map((option) => (
              <Card key={option.type} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 ${option.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <option.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {option.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {option.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {option.availability}
                      </p>
                      <Button className="mt-4 w-full" variant="outline">
                        {option.title}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-blue-500" />
              Quick Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Use the search bar above to quickly find specific help topics
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Check our video tutorials for step-by-step visual guides
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Contact support for personalized assistance with your specific needs
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}