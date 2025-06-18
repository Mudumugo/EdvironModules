import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Star, DollarSign, Clock, Globe } from "lucide-react";

interface TutorFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;
  selectedRating: number;
  setSelectedRating: (rating: number) => void;
  priceRange: string;
  setPriceRange: (range: string) => void;
  availability: string;
  setAvailability: (availability: string) => void;
  languages: string[];
  selectedLanguages: string[];
  setSelectedLanguages: (languages: string[]) => void;
  subjects: string[];
}

export default function TutorFilters({
  searchTerm,
  setSearchTerm,
  selectedSubject,
  setSelectedSubject,
  selectedRating,
  setSelectedRating,
  priceRange,
  setPriceRange,
  availability,
  setAvailability,
  languages,
  selectedLanguages,
  setSelectedLanguages,
  subjects
}: TutorFiltersProps) {
  const priceRanges = [
    { label: "All Prices", value: "all" },
    { label: "$10-20/hr", value: "10-20" },
    { label: "$20-50/hr", value: "20-50" },
    { label: "$50-100/hr", value: "50-100" },
    { label: "$100+/hr", value: "100+" }
  ];

  const availabilityOptions = [
    { label: "All Times", value: "all" },
    { label: "Available Now", value: "now" },
    { label: "Today", value: "today" },
    { label: "This Week", value: "week" }
  ];

  const toggleLanguage = (language: string) => {
    setSelectedLanguages(
      selectedLanguages.includes(language)
        ? selectedLanguages.filter(l => l !== language)
        : [...selectedLanguages, language]
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Filter Tutors</h3>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name, subject, or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Subject Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Subject
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            <option value="all">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            <Star className="inline h-4 w-4 mr-1" />
            Minimum Rating
          </label>
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            <option value={0}>Any Rating</option>
            <option value={3}>3+ Stars</option>
            <option value={4}>4+ Stars</option>
            <option value={4.5}>4.5+ Stars</option>
          </select>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            <DollarSign className="inline h-4 w-4 mr-1" />
            Price Range
          </label>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            {priceRanges.map(range => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </select>
        </div>

        {/* Availability Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            <Clock className="inline h-4 w-4 mr-1" />
            Availability
          </label>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            {availabilityOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Language Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            <Globe className="inline h-4 w-4 mr-1" />
            Languages
          </label>
          <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
            {languages.map(language => (
              <Button
                key={language}
                variant={selectedLanguages.includes(language) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleLanguage(language)}
                className="text-xs"
              >
                {language}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(selectedSubject !== "all" || selectedRating > 0 || priceRange !== "all" || availability !== "all" || selectedLanguages.length > 0) && (
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Active Filters:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedSubject !== "all" && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedSubject("all")}>
                {selectedSubject} ×
              </Badge>
            )}
            {selectedRating > 0 && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedRating(0)}>
                {selectedRating}+ Stars ×
              </Badge>
            )}
            {priceRange !== "all" && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setPriceRange("all")}>
                {priceRanges.find(p => p.value === priceRange)?.label} ×
              </Badge>
            )}
            {availability !== "all" && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setAvailability("all")}>
                {availabilityOptions.find(a => a.value === availability)?.label} ×
              </Badge>
            )}
            {selectedLanguages.map(language => (
              <Badge 
                key={language} 
                variant="secondary" 
                className="cursor-pointer" 
                onClick={() => toggleLanguage(language)}
              >
                {language} ×
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}