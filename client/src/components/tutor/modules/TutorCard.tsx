import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Clock, CheckCircle, MessageCircle, Video } from "lucide-react";
import type { Tutor } from "./TutorTypes";

interface TutorCardProps {
  tutor: Tutor;
  variant?: "regular" | "featured";
  onBookSession?: (tutorId: string) => void;
  onSendMessage?: (tutorId: string) => void;
}

export default function TutorCard({ tutor, variant = "regular", onBookSession, onSendMessage }: TutorCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const cardClass = variant === "featured" 
    ? "group hover:shadow-xl transition-all duration-200 hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 border-blue-200 dark:border-blue-700"
    : "group hover:shadow-lg transition-all duration-200 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700";

  return (
    <Card className={cardClass}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={tutor.avatar} alt={tutor.name} />
              <AvatarFallback>{tutor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
                {tutor.name}
                {tutor.verified && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </CardTitle>
              <p className="text-sm text-slate-500 dark:text-slate-400">{tutor.education}</p>
            </div>
          </div>
          {tutor.featured && (
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
              Featured
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            {renderStars(tutor.rating)}
          </div>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {tutor.rating} ({tutor.lessonsCompleted} lessons)
          </span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {tutor.subjects.slice(0, 3).map((subject, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {subject}
            </Badge>
          ))}
          {tutor.subjects.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tutor.subjects.length - 3} more
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
          {tutor.description}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Experience:</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">{tutor.experience}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Response time:</span>
            <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {tutor.responseTime}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Languages:</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {tutor.languages.slice(0, 2).join(', ')}
              {tutor.languages.length > 2 && ` +${tutor.languages.length - 2}`}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <div>
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              {tutor.hourlyRate}
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">/hour</span>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onSendMessage?.(tutor.id)}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => onBookSession?.(tutor.id)}
            >
              <Video className="h-4 w-4 mr-1" />
              Book Session
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}