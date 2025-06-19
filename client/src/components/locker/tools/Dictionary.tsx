import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  Search, 
  Volume2, 
  Bookmark,
  Clock,
  Globe,
  Lightbulb
} from "lucide-react";

interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics?: Array<{
    text?: string;
    audio?: string;
  }>;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms?: string[];
      antonyms?: string[];
    }>;
  }>;
  origin?: string;
}

export default function Dictionary() {
  const [searchWord, setSearchWord] = useState("");
  const [currentWord, setCurrentWord] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const { data: definition, isLoading, error } = useQuery({
    queryKey: ['dictionary', currentWord],
    queryFn: async () => {
      if (!currentWord) return null;
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${currentWord}`);
      if (!response.ok) throw new Error('Word not found');
      return response.json() as DictionaryEntry[];
    },
    enabled: !!currentWord,
    retry: false
  });

  const handleSearch = () => {
    if (searchWord.trim()) {
      setCurrentWord(searchWord.trim().toLowerCase());
      if (!recentSearches.includes(searchWord.trim().toLowerCase())) {
        setRecentSearches(prev => [searchWord.trim().toLowerCase(), ...prev.slice(0, 4)]);
      }
    }
  };

  const playPronunciation = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play().catch(err => console.log('Audio playback failed:', err));
  };

  const handleRecentSearch = (word: string) => {
    setSearchWord(word);
    setCurrentWord(word);
  };

  const entry = definition?.[0];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <BookOpen className="h-6 w-6 text-blue-600" />
          Oxford English Dictionary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Section */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Search for a word..."
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={!searchWord.trim()}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Recent:</span>
              {recentSearches.map((word, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleRecentSearch(word)}
                  className="h-7 text-xs"
                >
                  {word}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <span className="ml-2 text-gray-600">Looking up "{currentWord}"...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-medium text-red-800">Word not found</h3>
              <p className="text-red-600 text-sm mt-1">
                "{currentWord}" could not be found in the dictionary. Please check the spelling.
              </p>
            </div>
          </div>
        )}

        {/* Dictionary Entry */}
        {entry && !isLoading && (
          <div className="space-y-6">
            {/* Word Header */}
            <div className="border-b pb-4">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-gray-900">{entry.word}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>

              {/* Phonetics */}
              {entry.phonetics && entry.phonetics.length > 0 && (
                <div className="flex items-center gap-3 flex-wrap">
                  {entry.phonetics.map((phonetic, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {phonetic.text && (
                        <span className="text-lg text-gray-600 font-mono">
                          {phonetic.text}
                        </span>
                      )}
                      {phonetic.audio && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => playPronunciation(phonetic.audio!)}
                          className="h-8 w-8 p-0"
                        >
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Meanings */}
            <div className="space-y-6">
              {entry.meanings.map((meaning, meaningIndex) => (
                <div key={meaningIndex} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-medium">
                      {meaning.partOfSpeech}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {meaning.definitions.map((def, defIndex) => (
                      <div key={defIndex} className="pl-4 border-l-2 border-gray-200">
                        <p className="text-gray-900 leading-relaxed">
                          <span className="font-medium text-gray-600 mr-2">
                            {defIndex + 1}.
                          </span>
                          {def.definition}
                        </p>

                        {def.example && (
                          <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-start gap-2">
                              <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium text-blue-800">Example:</p>
                                <p className="text-blue-700 italic">"{def.example}"</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Synonyms and Antonyms */}
                        <div className="mt-3 space-y-2">
                          {def.synonyms && def.synonyms.length > 0 && (
                            <div className="flex items-start gap-2">
                              <span className="text-sm font-medium text-green-700 min-w-fit">
                                Synonyms:
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {def.synonyms.slice(0, 5).map((synonym, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs bg-green-50 text-green-700 border-green-200 cursor-pointer"
                                    onClick={() => handleRecentSearch(synonym)}
                                  >
                                    {synonym}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {def.antonyms && def.antonyms.length > 0 && (
                            <div className="flex items-start gap-2">
                              <span className="text-sm font-medium text-red-700 min-w-fit">
                                Antonyms:
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {def.antonyms.slice(0, 5).map((antonym, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs bg-red-50 text-red-700 border-red-200 cursor-pointer"
                                    onClick={() => handleRecentSearch(antonym)}
                                  >
                                    {antonym}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {meaningIndex < entry.meanings.length - 1 && <Separator />}
                </div>
              ))}
            </div>

            {/* Etymology */}
            {entry.origin && (
              <div className="border-t pt-4">
                <div className="flex items-start gap-2">
                  <Globe className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Etymology</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{entry.origin}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Welcome State */}
        {!currentWord && !isLoading && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Oxford English Dictionary
            </h3>
            <p className="text-gray-600 mb-4">
              Search for any word to explore its definition, pronunciation, and usage.
            </p>
            <div className="text-sm text-gray-500">
              Try searching for: "serendipity", "ephemeral", or "ubiquitous"
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}