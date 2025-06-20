import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, BookOpen, Clock, Star } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  type: 'article' | 'video' | 'guide';
  relevance: number;
}

interface SearchInterfaceProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: (query: string) => void;
}

export function SearchInterface({ searchQuery, onSearchChange, onSearch }: SearchInterfaceProps) {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // Simulate search - in real app would call API
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          id: '1',
          title: 'Getting Started with Digital Library',
          excerpt: 'Learn how to navigate and use the digital library features...',
          category: 'Digital Library',
          type: 'article',
          relevance: 0.95
        },
        {
          id: '2',
          title: 'Setting Up Your Profile',
          excerpt: 'Configure your user profile and preferences...',
          category: 'Account',
          type: 'guide',
          relevance: 0.87
        },
        {
          id: '3',
          title: 'Video: Platform Overview',
          excerpt: 'Watch this 5-minute overview of the Edvirons platform...',
          category: 'Getting Started',
          type: 'video',
          relevance: 0.82
        }
      ];
      
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 800);
    
    onSearch(searchQuery);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return BookOpen;
      case 'video': return Clock;
      case 'guide': return Star;
      default: return BookOpen;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search help articles, guides, and tutorials..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {searchResults.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">
            Search Results ({searchResults.length})
          </h3>
          
          {searchResults.map((result) => {
            const TypeIcon = getTypeIcon(result.type);
            return (
              <Card key={result.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TypeIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{result.title}</h4>
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                          {result.category}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{result.excerpt}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="capitalize">{result.type}</span>
                        <span>{Math.round(result.relevance * 100)}% match</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {searchQuery && searchResults.length === 0 && !isSearching && (
        <Card>
          <CardContent className="text-center py-8">
            <Search className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <h3 className="font-medium text-gray-900 mb-1">No results found</h3>
            <p className="text-sm text-gray-600">
              Try different keywords or browse our help categories below.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}