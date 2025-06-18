import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Star, BookOpen, Code, Calculator, Palette, MessageCircle, Globe, Gamepad2, Layers } from "lucide-react";
import type { AppCardProps, App } from "./AppTypes";

const getAppIcon = (iconText: string, category: string) => {
  switch (category) {
    case "Education": return BookOpen;
    case "Programming": return Code;
    case "Mathematics": return Calculator;
    case "Design": return Palette;
    case "Communication": return MessageCircle;
    case "Languages": return Globe;
    case "Gaming": return Gamepad2;
    default: return Layers;
  }
};

const getBadgeVariant = (app: App) => {
  if (app.recommended) return { text: "Recommended", class: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" };
  if (app.popular) return { text: "Popular", class: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" };
  if (app.trending) return { text: "Trending", class: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400" };
  if (app.essential) return { text: "Essential", class: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400" };
  if (app.premium) return { text: "Premium", class: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400" };
  return null;
};

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-3 w-3 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
    />
  ));
};

export default function AppCard({ app, variant = "regular" }: AppCardProps) {
  const IconComponent = getAppIcon(app.icon, app.category);
  const badge = getBadgeVariant(app);

  if (variant === "featured") {
    return (
      <Card className="group hover:shadow-xl transition-all duration-200 hover:-translate-y-1 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            {badge && (
              <Badge className={`text-xs ${badge.class}`}>
                {badge.text}
              </Badge>
            )}
          </div>
          <CardTitle className="text-lg text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {app.name}
          </CardTitle>
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            {app.description}
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-1">
              {renderStars(app.rating)}
              <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">{app.rating}</span>
            </div>
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{app.price}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">{app.downloads} downloads</span>
            <Button size="sm" asChild>
              <a href={app.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                Launch <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-md transition-all duration-200 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-lg">
            <IconComponent className="h-6 w-6 text-slate-600 dark:text-slate-300" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {app.name}
              </h3>
              {badge && (
                <Badge className={`text-xs ml-2 ${badge.class}`}>
                  {badge.text}
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
              {app.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  {renderStars(app.rating)}
                  <span className="text-sm text-slate-600 dark:text-slate-400">{app.rating}</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">{app.downloads}</span>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{app.price}</span>
              </div>
              <Button size="sm" asChild>
                <a href={app.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                  Launch <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}