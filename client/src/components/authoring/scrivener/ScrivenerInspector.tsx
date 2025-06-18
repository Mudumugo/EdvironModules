import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Archive,
  User,
  Tag,
  BookmarkPlus,
  Calendar,
  Target,
  Filter,
} from "lucide-react";
import { DocumentNode, ResearchItem, Character } from "./ScrivenerTypes";

interface ScrivenerInspectorProps {
  activeDoc: DocumentNode | null;
  research: ResearchItem[];
  characters: Character[];
}

export const ScrivenerInspector: React.FC<ScrivenerInspectorProps> = ({
  activeDoc,
  research,
  characters,
}) => {
  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 border-l">
      <Tabs defaultValue="document" className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-3 m-2">
          <TabsTrigger value="document">Document</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
          <TabsTrigger value="characters">Characters</TabsTrigger>
        </TabsList>

        <TabsContent value="document" className="flex-1 p-4 mt-0">
          {activeDoc ? (
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Document Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Type:</span>
                    <Badge variant="outline" className="text-xs capitalize">
                      {activeDoc.type}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <Badge variant="secondary" className="text-xs">
                      {activeDoc.status || 'draft'}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Words:</span>
                    <span>{activeDoc.wordCount || 0}</span>
                  </div>
                  {activeDoc.target && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Target:</span>
                      <span>{activeDoc.target}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Created:</span>
                    <span className="text-xs">
                      {activeDoc.created ? activeDoc.created.toLocaleDateString() : 'Today'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {activeDoc.labels && activeDoc.labels.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Labels
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1">
                      {activeDoc.labels.map(label => (
                        <Badge key={label} variant="outline" className="text-xs">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BookmarkPlus className="h-4 w-4" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Target className="h-4 w-4 mr-2" />
                    Set Target
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Tag className="h-4 w-4 mr-2" />
                    Add Label
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Set Deadline
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
              <FileText className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Select a document to view details</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="research" className="flex-1 mt-0">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Research Materials</h3>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="h-[calc(100%-60px)]">
              <div className="space-y-3">
                {research.map(item => (
                  <Card key={item.id} className="p-3">
                    <div className="flex items-start gap-2">
                      <Archive className="h-4 w-4 text-purple-600 mt-1" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {item.content}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {item.created.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="characters" className="flex-1 mt-0">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Characters</h3>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="h-[calc(100%-60px)]">
              <div className="space-y-3">
                {characters.map(character => (
                  <Card key={character.id} className="p-3">
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-orange-600 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{character.name}</h4>
                        <Badge variant="outline" className="text-xs mt-1">
                          {character.role}
                        </Badge>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                          {character.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {character.traits.map(trait => (
                            <Badge key={trait} variant="secondary" className="text-xs">
                              {trait}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};