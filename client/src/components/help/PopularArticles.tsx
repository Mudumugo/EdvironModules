import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, ChevronRight } from "lucide-react";
import { HelpArticle } from "./types";

interface PopularArticlesProps {
  articles: HelpArticle[];
  onArticleSelect: (articleId: string) => void;
}

export function PopularArticles({ articles, onArticleSelect }: PopularArticlesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Popular Articles
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onArticleSelect(article.id)}
            >
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{article.title}</h4>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {article.readTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    {article.rating}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {article.category}
                  </Badge>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}