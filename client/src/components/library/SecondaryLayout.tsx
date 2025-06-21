// Re-export from modular SecondaryLayout
export { SecondaryLayout } from './SecondaryLayout';

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Quick Access Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <Card className="bg-gradient-to-br from-blue-100 to-blue-200 border-0">
          <CardContent className="p-3 sm:p-4 text-center">
            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-blue-600" />
            <h3 className="font-semibold text-sm sm:text-base text-blue-800">New Books</h3>
            <p className="text-xs sm:text-sm text-blue-600">Added this week</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-100 to-green-200 border-0">
          <CardContent className="p-3 sm:p-4 text-center">
            <FileText className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-green-600" />
            <h3 className="font-semibold text-sm sm:text-base text-green-800">Popular Worksheets</h3>
            <p className="text-xs sm:text-sm text-green-600">Most accessed</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-0 sm:col-span-2 md:col-span-1">
          <CardContent className="p-3 sm:p-4 text-center">
            <Headphones className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-purple-600" />
            <h3 className="font-semibold text-sm sm:text-base text-purple-800">Audio Lessons</h3>
            <p className="text-xs sm:text-sm text-purple-600">Listen and learn</p>
          </CardContent>
        </Card>
      </div>

      {/* CBE Subjects */}
      <div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-center px-2">CBE Subjects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {categories.map((category, index) => {
            // Define colors for each category to ensure proper gradients
            const colorPalette = [
              'from-green-500 to-green-600',      // Mathematics - Green
              'from-blue-500 to-blue-600',        // English - Blue
              'from-purple-500 to-purple-600',    // Kiswahili - Purple
              'from-teal-500 to-teal-600',        // Science - Teal
              'from-red-500 to-red-600',          // Computer Science - Red
              'from-orange-500 to-orange-600',    // Creative Arts - Orange
              'from-indigo-500 to-indigo-600',    // Social Studies - Indigo
              'from-pink-500 to-pink-600',        // Additional subjects - Pink
              'from-yellow-500 to-yellow-600',    // Additional subjects - Yellow
              'from-cyan-500 to-cyan-600'         // Additional subjects - Cyan
            ];
            
            const gradientColor = category.color || colorPalette[index % colorPalette.length];
            
            return (
              <Card key={category.id} className={`${layout.cardStyle} bg-gradient-to-br ${gradientColor} text-white overflow-hidden h-full`}>
                <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-base sm:text-lg leading-tight">{category.name}</h3>
                      <p className="text-xs sm:text-sm opacity-90">Learning Resources</p>
                    </div>
                  </div>
                  
                  <div className="mb-4 flex-1">
                    <p className="text-xs sm:text-sm opacity-90 mb-3">Available Resources:</p>
                    <div className="flex justify-between text-center">
                      <div className="flex-1">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-1">
                          <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                        <p className="text-xs">Books</p>
                      </div>
                      <div className="flex-1">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-1">
                          <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                        <p className="text-xs">Worksheets</p>
                      </div>
                      <div className="flex-1">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-1">
                          <Video className="w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                        <p className="text-xs">Videos</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 text-white border-0 text-sm mt-auto">
                    View All
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Resource Type Tabs */}
      <Tabs defaultValue="books" className="mt-6 sm:mt-8">
        <TabsList className="grid grid-cols-3 sm:grid-cols-6 mb-4 sm:mb-6 h-auto p-1">
          <TabsTrigger value="books" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="sm:hidden">Books</span>
            <span className="hidden sm:inline">Digital Books</span>
          </TabsTrigger>
          <TabsTrigger value="worksheets" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
            <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="sm:hidden">Sheets</span>
            <span className="hidden sm:inline">Worksheets</span>
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
            <Video className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="sm:hidden">Videos</span>
            <span className="hidden sm:inline">Video Content</span>
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
            <Headphones className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="sm:hidden">Audio</span>
            <span className="hidden sm:inline">Audio Lessons</span>
          </TabsTrigger>
          <TabsTrigger value="games" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
            <Gamepad2 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="sm:hidden">Games</span>
            <span className="hidden sm:inline">Learning Games</span>
          </TabsTrigger>
          <TabsTrigger value="guides" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
            <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="sm:hidden">Guides</span>
            <span className="hidden sm:inline">Teacher Guides</span>
          </TabsTrigger>
        </TabsList>

        {['books', 'worksheets', 'videos', 'audio', 'games', 'guides'].map(type => (
          <TabsContent key={type} value={type}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {resources
                .filter(resource => resource.resourceType === type)
                .slice(0, 8)
                .map(resource => (
                  <ResourceCard 
                    key={resource.id} 
                    resource={resource} 
                    layout={layout}
                    onAccess={onResourceAccess}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Subject Performance Analytics (for secondary) */}
      <div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 px-2">Subject Performance Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {subjects.map((subject, index) => {
            const bgColors = [
              'bg-gradient-to-br from-blue-50 to-blue-100', 
              'bg-gradient-to-br from-green-50 to-green-100',
              'bg-gradient-to-br from-purple-50 to-purple-100',
              'bg-gradient-to-br from-orange-50 to-orange-100',
              'bg-gradient-to-br from-teal-50 to-teal-100',
              'bg-gradient-to-br from-red-50 to-red-100',
              'bg-gradient-to-br from-indigo-50 to-indigo-100',
              'bg-gradient-to-br from-pink-50 to-pink-100'
            ];
            
            return (
              <Card key={subject.id} className={`${layout.cardStyle} ${bgColors[index % bgColors.length]} border-0 h-full`}>
                <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                      <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-base sm:text-lg text-gray-800 leading-tight">{subject.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600">CBE Aligned</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 flex-1">
                    <div className="text-center">
                      <div className="text-lg sm:text-xl font-bold text-gray-800">{subject.resourceCount || 24}</div>
                      <div className="text-xs text-gray-600">Resources</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg sm:text-xl font-bold text-gray-800">{subject.lessonsCount || 12}</div>
                      <div className="text-xs text-gray-600">Lessons</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg sm:text-xl font-bold text-gray-800">{subject.quizzesCount || 8}</div>
                      <div className="text-xs text-gray-600">Quizzes</div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white transition-colors duration-200 text-sm mt-auto"
                    onClick={() => {
                      console.log('View resources for', subject.id);
                    }}
                  >
                    View All
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Learning Resource Hub */}
      <div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 px-2">Learning Resource Hub</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {[
            { title: 'VCU Past Papers', desc: 'Examination preparation', color: 'from-red-500 to-red-600', icon: FileText },
            { title: 'Scholarship Applications', desc: 'Funding opportunities', color: 'from-blue-500 to-blue-600', icon: Award },
            { title: 'Advanced Workshops', desc: 'Skills development', color: 'from-purple-500 to-purple-600', icon: GraduationCap },
            { title: 'Career Pathways', desc: 'Future planning', color: 'from-green-500 to-green-600', icon: BookOpen }
          ].map((item, index) => (
            <Card key={index} className={`${layout.cardStyle} bg-gradient-to-br ${item.color} text-white h-full`}>
              <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                <item.icon className="w-6 h-6 sm:w-8 sm:h-8 mb-3" />
                <h3 className="font-bold text-sm sm:text-base mb-2 leading-tight">{item.title}</h3>
                <p className="text-xs sm:text-sm opacity-90 mb-3 sm:mb-4 flex-1">{item.desc}</p>
                <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0 text-xs sm:text-sm mt-auto">
                  Explore
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Career Pathways (for Senior Secondary) */}
      {gradeLevel === 'senior_secondary' && (
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 px-2">CBE Career Pathways & Learning Routes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {[
              { 
                title: 'STEM Careers', 
                desc: 'Science, Technology, Engineering & Mathematics paths',
                color: 'from-blue-500 to-blue-600',
                subjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics']
              },
              { 
                title: 'Health & Life Sciences', 
                desc: 'Healthcare and life science career options',
                color: 'from-red-500 to-red-600',
                subjects: ['Biology', 'Chemistry', 'Health Science', 'Psychology']
              },
              { 
                title: 'Business & Entrepreneurship', 
                desc: 'Commerce and business management paths',
                color: 'from-green-500 to-green-600',
                subjects: ['Economics', 'Business Studies', 'Accounting', 'Marketing']
              }
            ].map((pathway, index) => (
              <Card key={index} className={`${layout.cardStyle} bg-gradient-to-br ${pathway.color} text-white h-full`}>
                <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                  <h3 className="font-bold text-base sm:text-lg mb-2 leading-tight">{pathway.title}</h3>
                  <p className="text-xs sm:text-sm opacity-90 mb-3 sm:mb-4 leading-tight flex-1">{pathway.desc}</p>
                  <div className="mb-3 sm:mb-4">
                    <p className="text-xs font-medium mb-2">Key Subjects:</p>
                    <div className="flex flex-wrap gap-1">
                      {pathway.subjects.map((subject, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-white/20 text-white text-xs px-2 py-1">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" className="w-full bg-white/20 hover:bg-white/30 text-white border-0 text-xs sm:text-sm">
                    Explore Pathway
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recent Resources */}
      <div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 px-2">Recently Added Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {resources.slice(0, 8).map(resource => (
            <ResourceCard 
              key={resource.id} 
              resource={resource} 
              layout={layout}
              onAccess={onResourceAccess}
            />
          ))}
        </div>
      </div>
    </div>
  );
};