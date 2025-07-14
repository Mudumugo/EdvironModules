import { Card, CardContent } from "@/components/ui/card";
import { 
  GraduationCap, 
  ArrowUpRight
} from "lucide-react";
import { Link } from "wouter";

export default function CBEHubCard() {
  return (
    <Link href="/cbe-hub">
      <Card className="hover:shadow-md transition-shadow cursor-pointer group border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20">
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            
            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              CBE Hub
            </h3>
            
            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
              Competency-based education tracking, assessments, and portfolio management
            </p>
            
            {/* Arrow Icon */}
            <div className="flex justify-end w-full">
              <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}